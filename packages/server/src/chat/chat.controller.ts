import { Body, Controller, Post } from '@nestjs/common';
import { ChatCompletionDto, ChatGetModelsDto } from './chat.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/models')
  getModels(@Body() getModelsDto: ChatGetModelsDto) {
    return this.chatService.getModels(getModelsDto);
  }

  @Post('/completions')
  createChatCompletion(@Body() data: ChatCompletionDto) {
    return this.chatService.createChatCompletion(data);
  }
}
