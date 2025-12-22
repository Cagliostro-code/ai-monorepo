import { request } from './request';

export function getStatus(baseUrl) {
  return request.get(`${baseUrl}/status`);
}
