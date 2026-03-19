export class ChatGetModelsDto {
  customUrl: string;
}

export class ChatMessageDto {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

export class ChatCompletionDto {
  id?: string;
  customUrl?: string;
  apiKey?: string;
  model?: string;
  message?: string;
  systemPrompt?: string;
  history?: ChatMessageDto[];
  messages?: ChatMessageDto[];
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stream?: boolean;
}
