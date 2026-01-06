import request from './request';

export function checkAndGetModels(customUrl: string) {
  return request.get('/link/models', { params: { customUrl } });
}
export function saveApiKey(configId: string, key: string) {
  return request.post('/link/saveApiKey', { id: configId, key });
}
