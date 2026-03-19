import { Injectable } from '@nestjs/common';
import { CommonException } from 'src/common/response/common.response';
import {
  ChatCompletionPayload,
  ChatCompletionMessage,
  ModelService,
} from 'src/common/http/model.service';
import { LinkConfigService } from 'src/link/link-config.service';
import { ChatCompletionDto, ChatGetModelsDto } from './chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly modelService: ModelService,
    private readonly linkConfigService: LinkConfigService,
  ) {}

  getModels(data: ChatGetModelsDto) {
    const { customUrl } = data;
    return this.modelService.getModels(
      customUrl,
      'sk-ocEhYdUR04KlnjCSDf1d55589722476791BbB7779075F2Df',
    );
  }

  async createChatCompletion(data: ChatCompletionDto): Promise<unknown> {
    const {
      id = 'default',
      customUrl,
      apiKey,
      model,
      message,
      systemPrompt,
      history = [],
      messages,
      temperature,
      topP,
      maxTokens,
      stream = false,
    } = data;

    const targetLinkInfo = this.linkConfigService.getTargetLinkInfo(id);
    const requestUrl = customUrl || targetLinkInfo.url;
    const requestApiKey = apiKey || targetLinkInfo.apiKey;
    const requestModel = model || targetLinkInfo.currentModel;

    if (!requestUrl) {
      throw CommonException.parameterInvalid('customUrl');
    }
    if (!requestApiKey) {
      throw CommonException.parameterInvalid('apiKey');
    }
    if (!requestModel) {
      throw CommonException.parameterInvalid('model');
    }

    const requestMessages = this.buildMessages({
      history,
      messages,
      message,
      systemPrompt,
    });

    if (requestMessages.length === 0) {
      throw CommonException.parameterInvalid('message');
    }

    const payload: ChatCompletionPayload = {
      model: requestModel,
      messages: requestMessages,
      stream,
    };

    if (temperature !== undefined) {
      payload.temperature = temperature;
    }
    if (topP !== undefined) {
      payload.top_p = topP;
    }
    if (maxTokens !== undefined) {
      payload.max_tokens = maxTokens;
    }

    const response = await this.modelService.createChatCompletion(
      requestUrl,
      requestApiKey,
      payload,
    );

    return response;
  }

  private buildMessages(data: {
    history: ChatCompletionMessage[];
    messages?: ChatCompletionMessage[];
    message?: string;
    systemPrompt?: string;
  }) {
    const { history, messages, message, systemPrompt } = data;

    if (Array.isArray(messages) && messages.length > 0) {
      return messages;
    }

    const result: ChatCompletionMessage[] = [];

    if (systemPrompt) {
      result.push({ role: 'system', content: systemPrompt });
    }

    if (Array.isArray(history) && history.length > 0) {
      result.push(...history);
    }

    if (message) {
      result.push({ role: 'user', content: message });
    }

    return result;
  }
}
