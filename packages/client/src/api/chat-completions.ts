import { request } from './request';

export function checkAndGetModels(customUrl: string) {
  return request.get(`/models`, { params: { customUrl } });
}
