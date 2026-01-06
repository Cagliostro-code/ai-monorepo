import { Injectable } from '@nestjs/common';
import { mapModels, ModelService } from 'src/common/http/model.service';
import { CommonSuccess } from 'src/common/response/common.response';
import { LinkException } from 'src/common/response/link.exception';

@Injectable()
export class LinkService {
  constructor(private readonly modelService: ModelService) {}

  async getModels(customUrl: string, apiKey: string) {
    const res = await this.modelService.getModels(customUrl, apiKey);

    if (Array.isArray(res.data)) {
      return new CommonSuccess('获取模型列表成功', mapModels(res.data));
    }
    return LinkException.cannotGetModels();
  }

  saveApiKey(id: undefined | string, key: string) {
    console.log(id, key);
    if (id) {
      console.log('[ id ] >', id);
    } else {
      console.log('[ key ] >', key);
    }

    return new CommonSuccess('保存成功');
  }
}
