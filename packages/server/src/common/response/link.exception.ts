import { CommonException } from './common.response';

const LinkExceptionEnum = {
  cannotGetModels: '20001',
};

export class LinkException extends CommonException {
  constructor(message: string, code: string) {
    super(message, code);
  }

  static cannotGetModels() {
    return new LinkException('无法获取模型列表', LinkExceptionEnum.cannotGetModels);
  }
}
