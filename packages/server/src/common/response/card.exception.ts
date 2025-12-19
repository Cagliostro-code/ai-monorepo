import { CommonException } from './common.response';

const CardExceptionEnum = {
  cardExists: '10001',
};

export class CardException extends CommonException {
  constructor(message: string, code: string) {
    super(message, code);
  }

  static cardExists() {
    return new CardException('角色卡已存在', CardExceptionEnum.cardExists);
  }
}
