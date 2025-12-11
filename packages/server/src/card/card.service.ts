import { Injectable } from '@nestjs/common';

@Injectable()
export class CardService {
  getHello(): string {
    return 'Hello World!';
  }
}
