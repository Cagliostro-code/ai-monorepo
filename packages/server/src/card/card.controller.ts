import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { CardService } from './card.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CharacterCardParseChunksPipe,
  CharacterCardValidationPipe,
  PngChunk,
} from 'src/common/pipe/upload.pipe';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(new CharacterCardValidationPipe(), new CharacterCardParseChunksPipe())
    file: PngChunk[],
  ): string {
    console.log(file);
    return this.cardService.getHello();
  }
}
