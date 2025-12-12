import { CardModule } from './card/card.module';
import { Module } from '@nestjs/common';
import { ChatController } from './chat/chat.controller';

@Module({
  imports: [CardModule],
  controllers: [ChatController],
  providers: [],
})
export class AppModule {}
