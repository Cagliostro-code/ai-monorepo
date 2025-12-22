import { ChatService } from './chat.service';
import { ModelHttpModule } from 'src/common/http/index.module';
import { ChatController } from './chat.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [ModelHttpModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
