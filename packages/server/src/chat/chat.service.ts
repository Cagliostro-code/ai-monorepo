import { Injectable } from '@nestjs/common';
import { ChatGetModelsDto } from './chat.dto';
import { ModelService } from 'src/common/http/model.service';

@Injectable()
export class ChatService {
  constructor(private readonly modelService: ModelService) {}

  getModels(data: ChatGetModelsDto) {
    const { customUrl } = data;
    return this.modelService.getModels(
      customUrl,
      'sk-ocEhYdUR04KlnjCSDf1d55589722476791BbB7779075F2Df',
    );
  }
}
