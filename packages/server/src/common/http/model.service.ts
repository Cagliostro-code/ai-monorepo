import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GetModels, ModelItem, ModelItemVO } from 'src/types/model';

@Injectable()
export class ModelService {
  constructor(private readonly httpService: HttpService) {}

  async getModels(url: string, token: string) {
    const res = await firstValueFrom(
      this.httpService.get(`${url}/models`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }),
    );
    return res.data as GetModels;
  }
}

export function mapModels(data: ModelItem[]): ModelItemVO[] {
  return data.map(item => {
    const { id, object, owned_by, root } = item;

    return { id, object, ownedBy: owned_by, root };
  });
}
