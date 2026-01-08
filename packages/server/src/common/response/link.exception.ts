import { CommonException } from './common.response';

const LinkExceptionEnum = {
  cannotGetModels: '20001',
  linkInfoNotFound: '20002',
};

export class LinkException extends CommonException {
  constructor(message: string, code: string) {
    super(message, code);
  }

  static linkInfoNotFound() {
    return new LinkException('链接信息未找到', LinkExceptionEnum.linkInfoNotFound);
  }

  static cannotGetModels() {
    return new LinkException('无法获取模型列表', LinkExceptionEnum.cannotGetModels);
  }
}
