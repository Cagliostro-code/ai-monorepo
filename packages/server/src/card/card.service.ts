import { Injectable, Logger } from '@nestjs/common';
import { PngChunk } from './card.pipe';
import fs from 'node:fs';
import { ConfigService } from '@nestjs/config';
import { CardConfig } from 'src/common/config/configuration';
import path from 'node:path';
import { CardInfoGroup } from 'src/types/card';
import { CardException } from 'src/common/response/card.exception';
import { CommonSuccess } from 'src/common/response/common.response';

@Injectable()
export class CardService {
  private readonly logger = new Logger(CardService.name);
  private readonly dataCardDir: string;
  private readonly dataCardInfoDir: string;
  private cardInfo: CardInfoGroup = {};

  constructor(private configService: ConfigService) {
    const cardConfig = this.configService.get('card') as CardConfig;
    this.dataCardDir = path.join(process.cwd(), cardConfig.address.card);
    this.dataCardInfoDir = path.join(this.dataCardDir, cardConfig.address.cardInfo);

    if (!fs.existsSync(this.dataCardInfoDir)) {
      fs.writeFileSync(this.dataCardInfoDir, '{}');
    }

    this.cardInfo = this.loadCardInfoFromFile();
  }

  save(file: Express.Multer.File, chunks: PngChunk[]) {
    const originalname = file.originalname;
    const filePath = this.dataCardDir + '/' + file.originalname;
    if (fs.existsSync(filePath)) {
      return CardException.cardExists();
    }
    console.log(file, chunks);
    fs.writeFileSync(filePath, file.buffer);
    this.cardInfo[originalname] = { name: file.originalname, path: filePath };
    return new CommonSuccess('保存成功');
  }

  loadCardInfoFromFile(): CardInfoGroup {
    const parsedInfo = JSON.parse(fs.readFileSync(this.dataCardInfoDir, 'utf-8')) as CardInfoGroup;
    if (typeof parsedInfo !== 'object' || parsedInfo === null) {
      throw new Error('异常的角色卡列表信息');
    }
    return parsedInfo;
  }
}
