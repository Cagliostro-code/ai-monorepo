import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

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
    return res.data as GetModelsVO;
  }
}

export interface GetModelsVO {
  data: ModelItemVO[];
  object: string;
}

export interface ModelItemVO {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  root: string;
  permission: ModelPermission[] | null;
}

export interface ModelPermission {
  id: string;
  object: string;
  created: number;
  allow_create_engine: boolean;
  allow_sampling: boolean;
  allow_logprobs: boolean;
  allow_online_finetuning: boolean;
  allow_offline_finetuning: boolean;
  allow_view: boolean;
  allow_edit: boolean;
  organization: string;
  group: string | null;
  is_blocking: boolean;
}
