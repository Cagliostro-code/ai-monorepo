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
  private readonly dataCardInfoFile: string;
  private cardInfo: CardInfoGroup = {};

  constructor(private configService: ConfigService) {
    const cardConfig = this.configService.get('card') as CardConfig;
    this.dataCardDir = path.join(process.cwd(), cardConfig.address.card);
    this.dataCardInfoFile = path.join(this.dataCardDir, cardConfig.address.cardInfo);

    this.cardInfo = this.loadCardInfoFromFile();
  }

  save(file: Express.Multer.File, chunks: PngChunk[]) {
    const originalname = file.originalname;
    const filePath = this.dataCardDir + '/' + file.originalname;
    if (fs.existsSync(filePath)) {
      return CardException.cardExists();
    }
    console.log(file, chunks);
    const customData = this.getCardInitData(chunks);
    console.log(customData, typeof customData);
    if (!customData) {
      return CardException.cardInfoNotFound();
    }

    if (typeof customData !== 'object') {
      return CardException.cardInfoCannotBeParsed();
    }
    this.cardInfo[originalname] = { name: file.originalname, path: filePath };
    const tempPath = this.dataCardDir + '.temp';

    fs.writeFileSync(filePath, file.buffer);
    fs.writeFileSync(tempPath, JSON.stringify(this.cardInfo));
    fs.renameSync(tempPath, this.dataCardInfoFile);

    return new CommonSuccess('保存成功');
  }

  loadCardInfoFromFile(): CardInfoGroup {
    const parsedInfo = JSON.parse(fs.readFileSync(this.dataCardInfoFile, 'utf-8')) as CardInfoGroup;
    if (typeof parsedInfo !== 'object' || parsedInfo === null) {
      throw new Error('异常的角色卡列表信息');
    }
    return parsedInfo;
  }

  getCardInitData(chunks: PngChunk[]) {
    const chunk = chunks.find(item => item.type === 'tEXt');

    if (!chunk) return;

    return chunk.data;
  }
}
