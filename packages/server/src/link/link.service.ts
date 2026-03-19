import { Injectable } from '@nestjs/common';
import { ModelService, mapModels } from 'src/common/http/model.service';
import { CommonSuccess } from 'src/common/response/common.response';
import { LinkException } from 'src/common/response/link.exception';
import { LinkConfigService } from './link-config.service';

@Injectable()
export class LinkService {
  constructor(
    private readonly modelService: ModelService,
    private readonly linkConfigService: LinkConfigService,
  ) {}

  getLinkInfoList() {
    const list = this.linkConfigService.getLinkInfoList();
    return new CommonSuccess('Link config list loaded', list);
  }

  async getModels(id: string) {
    const targetLinkInfo = this.linkConfigService.findLinkInfo(id);
    if (!targetLinkInfo) {
      return LinkException.linkInfoNotFound();
    }

    const { url, apiKey } = targetLinkInfo;
    const res = await this.modelService.getModels(url, apiKey);

    if (Array.isArray(res.data)) {
      return new CommonSuccess('Model list loaded', mapModels(res.data));
    }

    return LinkException.cannotGetModels();
  }

  saveUrl(id: string, url: string) {
    const targetId = this.linkConfigService.saveUrl(id, url);
    return new CommonSuccess('Saved successfully', targetId);
  }

  saveApiKey(id: string, key: string) {
    this.linkConfigService.saveApiKey(id, key);
    return new CommonSuccess('Saved successfully');
  }

  saveCurrentModel(id: string, currentModel: string) {
    this.linkConfigService.saveCurrentModel(id, currentModel);
    return new CommonSuccess('Saved successfully');
  }
}
