import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';

import { CardModule } from './card/card.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    CardModule,
    ChatModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
