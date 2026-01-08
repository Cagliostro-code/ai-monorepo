import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'node:path';
import fs from 'node:fs';
import { LinkConfig } from 'src/common/config/configuration';
import { LinkInfoGroup } from 'src/types/link';
import { ModelService } from 'src/common/http/model.service';
import { mapModels } from 'src/common/http/model.service';
import { CommonSuccess } from 'src/common/response/common.response';
import { LinkException } from 'src/common/response/link.exception';
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

  async getModels(id: string) {
    const targetLinkInfo = this.linkInfo[id];
    if (!targetLinkInfo) {
      return LinkException.linkInfoNotFound();
    }
    const { url, apiKey } = targetLinkInfo;
    const res = await this.modelService.getModels(url, apiKey);

    if (Array.isArray(res.data)) {
      return new CommonSuccess('获取模型列表成功', mapModels(res.data));
    }
    return LinkException.cannotGetModels();
  }

  saveUrl(id: string, url: string) {
    let targetLinkInfo = this.linkInfo[id];
    if (!targetLinkInfo) {
      targetLinkInfo = { id, name: 'Default', url: '', apiKey: '', currentModel: '' };
      this.linkInfo[id] = targetLinkInfo;
    }

    targetLinkInfo.url = url;
    this.linkInfo[id] = targetLinkInfo;

    coverFile(this.dataLinkInfoFile, JSON.stringify(this.linkInfo, null, 2));

    return new CommonSuccess('保存成功', id);
  }

  saveApiKey(id: string, key: string) {
    let targetLinkInfo = this.linkInfo[id];
    if (!targetLinkInfo) {
      targetLinkInfo = { id, name: 'Default', url: '', apiKey: '', currentModel: '' };
      this.linkInfo[id] = targetLinkInfo;
    }

    targetLinkInfo.apiKey = key;
    this.linkInfo[id] = targetLinkInfo;

    coverFile(this.dataLinkInfoFile, JSON.stringify(this.linkInfo, null, 2));

    return new CommonSuccess('保存成功');
  }
}
