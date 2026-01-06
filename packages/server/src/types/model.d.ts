export interface ModelItemVO {
  id: string;
  object: string;
  ownedBy: string;
  root: string;
}

export interface GetModels {
  data: ModelItem[];
  object: string;
}

export interface ModelItem {
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
