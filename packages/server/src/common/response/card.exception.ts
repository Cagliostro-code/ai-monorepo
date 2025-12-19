import { CommonException } from './common.response';

const CardExceptionEnum = {
  cardExists: '10001',
  cardInfoNotFound: '10002',
  cardInfoCannotBeParsed: '10003',
};

export class CardException extends CommonException {
  constructor(message: string, code: string) {
    super(message, code);
  }

  static cardExists() {
    return new CardException('角色卡已存在', CardExceptionEnum.cardExists);
  }

  static cardInfoNotFound() {
    return new CardException('角色卡信息未找到', CardExceptionEnum.cardInfoNotFound);
  }

  static cardInfoCannotBeParsed() {
    return new CardException('角色卡信息无法解析', CardExceptionEnum.cardInfoCannotBeParsed);
  }
}
