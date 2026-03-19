import request from './request';

export function getConfig() {
  return request.get('/link/config');
}
export function checkAndGetModels(id: string) {
  return request.get('/link/models', { params: { id } });
}
export function saveUrl(id: string, url: string) {
  return request.put('/link/saveUrl', { url, id });
}
export function saveCurrentModel(id: string, model: string) {
  return request.put('/link/saveCurrentModel', { id, model });
}
export function saveApiKey(configId: string, key: string) {
  return request.put('/link/saveApiKey', { id: configId, key });
}
