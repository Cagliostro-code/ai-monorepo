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
    return new LinkException('Link config not found', LinkExceptionEnum.linkInfoNotFound);
  }

  static cannotGetModels() {
    return new LinkException('Failed to load model list', LinkExceptionEnum.cannotGetModels);
  }
}
