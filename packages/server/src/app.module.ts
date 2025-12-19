import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';

import { CardModule } from './card/card.module';
import { Module } from '@nestjs/common';
import { ChatController } from './chat/chat.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), CardModule],
  controllers: [ChatController],
  providers: [],
})
export class AppModule {}
