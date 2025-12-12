/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { CardInitService } from './card-init.service';

@Module({
  imports: [],
  controllers: [CardController],
  providers: [CardService, CardInitService],
})
export class CardModule {}
