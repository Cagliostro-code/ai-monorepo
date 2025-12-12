import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import path from 'node:path';
import fs from 'node:fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CardInitService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CardInitService.name);
  private readonly dataDir: string;
  private readonly dataCardDir: string;
  private readonly dataCardInfoDir: string;

  constructor(private configService: ConfigService) {
    this.dataDir = path.join(
      process.cwd(),
      this.configService.get<string>('address.root') || 'data',
    );

    this.dataCardDir = path.join(
      process.cwd(),
      this.configService.get<string>('address.card') || 'data/card',
    );

    this.dataCardInfoDir = path.join(
      process.cwd(),
      this.configService.get<string>('address.cardInfo') || 'data/card-info',
    );
  }

  onApplicationBootstrap() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir);
    }
    if (!fs.existsSync(this.dataCardDir)) {
      fs.mkdirSync(this.dataCardDir);
    }
    if (!fs.existsSync(this.dataCardInfoDir)) {
      fs.mkdirSync(this.dataCardInfoDir);
    }
    this.logger.log('角色卡目录初始化完成');
  }
}
