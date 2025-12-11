import { Module } from '@nestjs/common';
import { CardController } from './card/card.controller';
import { CardService } from './card/card.service';
import { ChatController } from './chat/chat.controller';

@Module({
  imports: [],
  controllers: [CardController, ChatController],
  providers: [CardService],
})
export class AppModule {}
