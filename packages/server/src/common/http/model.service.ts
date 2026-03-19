import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
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
  constructor(private readonly httpService: HttpService) {}

  async getModels(url: string, token: string) {
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${url}/models`, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }),
      );
      return res.data as GetModels;
    } catch (e) {
      // 捕获axios相关的错误
      if (e && typeof e === 'object' && 'code' in e && e.code === 'ERR_INVALID_URL') {
        throw CommonException.invalidUrl(url);
      }

      throw e;
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
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        }),
      );

      return res.data as unknown;
    } catch (e) {
      if (e && typeof e === 'object' && 'code' in e && e.code === 'ERR_INVALID_URL') {
        throw CommonException.invalidUrl(url);
      }

      if (
        e &&
        typeof e === 'object' &&
        'response' in e &&
        e.response &&
        typeof e.response === 'object' &&
        'data' in e.response
      ) {
        const responseData = e.response.data;
        const message =
          typeof responseData === 'string'
            ? responseData
            : typeof responseData === 'object' &&
                responseData &&
                'error' in responseData &&
                responseData.error &&
                typeof responseData.error === 'object' &&
                'message' in responseData.error
              ? String(responseData.error.message)
              : undefined;

        throw CommonException.requestFailed(message);
      }

      throw e;
    }
  }
}

export function mapModels(data: ModelItem[]): ModelItemVO[] {
  return data.map(item => {
    const { id, object, owned_by, root } = item;

    return { id, object, ownedBy: owned_by, root };
  });
}
