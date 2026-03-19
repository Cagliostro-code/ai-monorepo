import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'node:fs';
import path from 'node:path';
import { LinkConfig } from 'src/common/config/configuration';
import { coverFile } from 'src/common/utils/file.util';
import { LinkInfo, LinkInfoGroup } from 'src/types/link';

@Injectable()
export class LinkConfigService {
  private readonly dataDir: string;
  private readonly dataLinkDir: string;
  private readonly dataLinkInfoFile: string;

  private linkInfo: LinkInfoGroup = {};

  private readonly defaultLinkInfo: LinkInfo = {
    id: 'default',
    name: 'Default',
    url: '',
    apiKey: '',
    currentModel: '',
  };

  constructor(private readonly configService: ConfigService) {
    const linkConfig = this.configService.get('link') as LinkConfig;
    this.dataDir = path.join(process.cwd(), linkConfig.address.root);
    this.dataLinkDir = path.join(process.cwd(), linkConfig.address.link);
    this.dataLinkInfoFile = path.join(this.dataLinkDir, linkConfig.address.linkInfo);

    this.ensureDataFiles();
    this.linkInfo = this.loadLinkInfoFromFile();
  }

  getLinkInfoList() {
    return Object.keys(this.linkInfo).map(id => this.linkInfo[id]);
  }

  findLinkInfo(id: string) {
    return this.linkInfo[id];
  }

  getTargetLinkInfo(id: string) {
    const targetId = id || 'default';
    let targetLinkInfo = this.linkInfo[targetId];
    if (!targetLinkInfo) {
      targetLinkInfo = { ...this.defaultLinkInfo, id: targetId };
      this.linkInfo[targetId] = targetLinkInfo;
    }

    return targetLinkInfo;
  }

  saveUrl(id: string, url: string) {
    const targetLinkInfo = this.getTargetLinkInfo(id);
    targetLinkInfo.url = url;
    this.persist();

    return targetLinkInfo.id;
  }

  saveApiKey(id: string, apiKey: string) {
    const targetLinkInfo = this.getTargetLinkInfo(id);
    targetLinkInfo.apiKey = apiKey;
    this.persist();
  }

  saveCurrentModel(id: string, currentModel: string) {
    const targetLinkInfo = this.getTargetLinkInfo(id);
    targetLinkInfo.currentModel = currentModel;
    this.persist();
  }

  private ensureDataFiles() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir);
    }
    if (!fs.existsSync(this.dataLinkDir)) {
      fs.mkdirSync(this.dataLinkDir);
    }
    if (!fs.existsSync(this.dataLinkInfoFile)) {
      fs.writeFileSync(this.dataLinkInfoFile, '{}');
    }
  }

  private loadLinkInfoFromFile(): LinkInfoGroup {
    const parsedInfo = JSON.parse(fs.readFileSync(this.dataLinkInfoFile, 'utf-8')) as LinkInfoGroup;
    if (typeof parsedInfo !== 'object' || parsedInfo === null) {
      throw new Error('Invalid link config data');
    }
    return parsedInfo;
  }

  private persist() {
    coverFile(this.dataLinkInfoFile, JSON.stringify(this.linkInfo, null, 2));
  }
}
