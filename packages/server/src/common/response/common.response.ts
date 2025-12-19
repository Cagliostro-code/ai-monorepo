export class CommonException {
  private readonly success: boolean = false;
  private message: string;
  private code: string;

  constructor(message: string, code: string) {
    this.message = message;
    this.code = code;
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
