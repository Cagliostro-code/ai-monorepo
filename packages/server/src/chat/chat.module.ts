import { ChatService } from './chat.service';
import { ModelHttpModule } from 'src/common/http/index.module';
import { ChatController } from './chat.controller';
import { LinkModule } from 'src/link/link.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [ModelHttpModule, LinkModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
