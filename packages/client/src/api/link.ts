import request from './request';

export function checkAndGetModels(id: string) {
  return request.get('/link/models', { params: { id } });
}
export function saveUrl(id: string, url: string) {
  return request.put('/link/saveUrl', { url, id });
}
export function saveApiKey(configId: string, key: string) {
  return request.put('/link/saveApiKey', { id: configId, key });
}
