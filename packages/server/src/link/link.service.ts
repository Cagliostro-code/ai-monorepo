import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'node:path';
import fs from 'node:fs';
import { LinkConfig } from 'src/common/config/configuration';
import { mapModels, ModelService } from 'src/common/http/model.service';
import { CommonSuccess } from 'src/common/response/common.response';
import { LinkException } from 'src/common/response/link.exception';
import { LinkInfoGroup } from 'src/types/link';
import { coverFile } from 'src/common/utils/file.util';

@Injectable()
export class LinkService {
  private readonly dataDir: string;
  private readonly dataLinkDir: string;
  private readonly dataLinkInfoFile: string;
  private linkInfo: LinkInfoGroup = {};

  constructor(
    private readonly configService: ConfigService,
    private readonly modelService: ModelService,
  ) {
    const linkConfig = this.configService.get('link') as LinkConfig;
    this.dataDir = path.join(process.cwd(), linkConfig.address.root);
    this.dataLinkDir = path.join(process.cwd(), linkConfig.address.link);
    this.dataLinkInfoFile = path.join(this.dataLinkDir, linkConfig.address.linkInfo);

    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir);
    }
    if (!fs.existsSync(this.dataLinkDir)) {
      fs.mkdirSync(this.dataLinkDir);
    }
    if (!fs.existsSync(this.dataLinkInfoFile)) {
      fs.writeFileSync(this.dataLinkInfoFile, '{}');
    }

    this.linkInfo = this.loadLinkInfoFromFile();
  }

  loadLinkInfoFromFile(): LinkInfoGroup {
    const parsedInfo = JSON.parse(fs.readFileSync(this.dataLinkInfoFile, 'utf-8')) as LinkInfoGroup;
    if (typeof parsedInfo !== 'object' || parsedInfo === null) {
      throw new Error('异常的Link信息');
    }
    return parsedInfo;
  }

  async getModels(customUrl: string, apiKey: string) {
    const res = await this.modelService.getModels(customUrl, apiKey);

    if (Array.isArray(res.data)) {
      return new CommonSuccess('获取模型列表成功', mapModels(res.data));
    }
    return LinkException.cannotGetModels();
  }

  saveApiKey(id: string, key: string) {
    console.log(id, key);
    let targetLinkInfo = this.linkInfo[id];
    if (!targetLinkInfo) {
      targetLinkInfo = { id, name: 'Default', url: '', apiKey: '', currentModel: '' };
      this.linkInfo[id] = targetLinkInfo;
    }
    console.log('[ targetLinkInfo ] >', targetLinkInfo);

    targetLinkInfo.apiKey = key;
    this.linkInfo[id] = targetLinkInfo;
    console.log('[ linkInfo ] >', this.linkInfo);
    console.log('[ linkInfo ] >', JSON.stringify(this.linkInfo));

    coverFile(this.dataLinkInfoFile, JSON.stringify(this.linkInfo));

    return new CommonSuccess('保存成功');
  }
}
