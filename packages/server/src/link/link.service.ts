import { Injectable } from '@nestjs/common';
import { ModelService } from 'src/common/http/model.service';
import { CommonSuccess } from 'src/common/response/common.response';

@Injectable()
export class LinkService {
  constructor(private readonly modelService: ModelService) {}

  async getModels(customUrl: string, apiKey: string) {
    const data = await this.modelService.getModels(customUrl, apiKey);
    return new CommonSuccess(data);
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
