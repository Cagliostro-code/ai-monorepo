import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { CardService } from './card.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CharacterCardParseChunksPipe, CharacterCardValidationPipe } from './card.pipe';
import type { ParseFileInfo } from './card.pipe';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(new CharacterCardValidationPipe(), new CharacterCardParseChunksPipe())
    file: ParseFileInfo,
  ) {
    return this.cardService.save(file.file, file.chunks);
  }
}
