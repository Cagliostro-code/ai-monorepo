import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import path from 'node:path';
import fs from 'node:fs';
import { ConfigService } from '@nestjs/config';
import { CardConfig } from 'src/common/config/configuration';
import { CardService } from './card.service';

@Injectable()
export class CardOnModuleInit implements OnModuleInit {
  constructor(private cardService: CardService) {}

  onModuleInit() {
    this.cardService.loadCardInfoFromFile(); // 如果参数不对就中断
  }
}

@Injectable()
export class CardOnApplicationBootstrap implements OnApplicationBootstrap {
  private readonly logger = new Logger(CardOnApplicationBootstrap.name);
  private readonly dataDir: string;
  private readonly dataCardDir: string;
  private readonly dataCardInfoFile: string;

  constructor(private configService: ConfigService) {
    const cardConfig = this.configService.get('card') as CardConfig;

    this.dataDir = path.join(process.cwd(), cardConfig.address.root);
    this.dataCardDir = path.join(process.cwd(), cardConfig.address.card);
    this.dataCardInfoFile = path.join(this.dataCardDir, cardConfig.address.cardInfo);
  }

  onApplicationBootstrap() {
    this.initCardFolder();
  }

  initCardFolder() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir);
    }
    if (!fs.existsSync(this.dataCardDir)) {
      fs.mkdirSync(this.dataCardDir);
    }
    if (!fs.existsSync(this.dataCardInfoFile)) {
      fs.writeFileSync(this.dataCardInfoFile, '{}');
    }
    this.logger.log('角色卡目录初始化完成');
  }
}
