import { Injectable } from '@nestjs/common';
import { PngChunk } from './card.pipe';

@Injectable()
export class CardService {
  getHello(): string {
    return 'Hello World!';
  }

  save(file: Express.Multer.File, chunks: PngChunk[]): string {
    console.log(file, chunks);
    return 'This action adds a new card';
  }
}
