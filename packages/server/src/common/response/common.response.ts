export const CommonExceptionEnum = {
  parameterInvalid: '00001',
  invalidUrl: '00002',
  requestFailed: '00003',
};
export class CommonException extends Error {
  private readonly success: boolean = false;
  code: string;

  constructor(message: string, code: string) {
    super();
    this.message = message;
    this.code = code;
  }

  static parameterInvalid(parameterName: string): CommonException {
    return new CommonException(
      `Parameter '${parameterName}' is invalid`,
      CommonExceptionEnum.parameterInvalid,
    );
  }

  static invalidUrl(url?: string) {
    return new CommonException(`无效的URL: ${url || '未知URL'}`, CommonExceptionEnum.invalidUrl);
  }

  static requestFailed(message?: string) {
    return new CommonException(
      `请求失败: ${message || '未知错误'}`,
      CommonExceptionEnum.requestFailed,
    );
  }
}

export class CommonSuccess {
  private readonly success: boolean = true;
  private readonly code: string = '00000';
  private message: string;
  private data: any;

  constructor(message: string, data?: unknown) {
    this.message = message;
    this.data = data;
  }
}
