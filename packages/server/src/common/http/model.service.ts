import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { GetModels, ModelItem, ModelItemVO } from 'src/types/model';
import { CommonException } from '../response/common.response';

export interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

export interface ChatCompletionPayload {
  model: string;
  messages: ChatCompletionMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
}

@Injectable()
export class ModelService {
  private readonly logger = new Logger(ModelService.name);

  constructor(private readonly httpService: HttpService) {}

  async getModels(url: string, token: string) {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${url}/models`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
      return res.data as GetModels;
    } catch (error) {
      this.handleHttpError(error, url);
    }
  }

  async createChatCompletion(
    url: string,
    token: string,
    payload: ChatCompletionPayload,
  ): Promise<unknown> {
    try {
      const res = await firstValueFrom(
        this.httpService.post(`${url}/chat/completions`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      return res.data as unknown;
    } catch (error) {
      this.handleHttpError(error, url);
    }
  }

  private handleHttpError(error: unknown, url: string): never {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_INVALID_URL') {
      throw CommonException.invalidUrl(url);
    }

    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = this.extractResponseMessage(error.response?.data);

      if (status) {
        throw CommonException.externalRequestError(status, message);
      }

      throw CommonException.requestFailed(message || error.message);
    }

    throw error;
  }

  private extractResponseMessage(responseData: unknown) {
    if (this.isPrimitiveMessage(responseData)) {
      return `${responseData}`;
    }

    if (typeof responseData === 'object' && responseData) {
      if ('message' in responseData) {
        const message = responseData.message;

        if (this.isPrimitiveMessage(message)) {
          return `${message}`;
        }

        if (message !== undefined) {
          this.logger.warn(
            `Ignored non-primitive external error message: ${this.safeSerialize(message)}`,
          );
        }
      }

      if ('error' in responseData && responseData.error && typeof responseData.error === 'object') {
        const errorData = responseData.error;

        if (!('message' in errorData)) {
          return undefined;
        }

        const errorMessage = errorData.message;

        if (this.isPrimitiveMessage(errorMessage)) {
          return `${errorMessage}`;
        }

        if (errorMessage !== undefined) {
          this.logger.warn(
            `Ignored non-primitive external error.error.message: ${this.safeSerialize(errorMessage)}`,
          );
        }
      }
    }

    return undefined;
  }

  private isPrimitiveMessage(value: unknown): value is string | number | boolean | bigint {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      typeof value === 'bigint'
    );
  }

  private safeSerialize(value: unknown) {
    try {
      return JSON.stringify(value);
    } catch {
      return '[unserializable value]';
    }
  }
}

export function mapModels(data: ModelItem[]): ModelItemVO[] {
  return data.map(item => {
    const { id, object, owned_by, root } = item;

    return { id, object, ownedBy: owned_by, root };
  });
}
