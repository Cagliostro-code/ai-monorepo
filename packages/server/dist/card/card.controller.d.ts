import { CardService } from './card.service';
import { PngChunk } from 'src/common/pipe/upload.pipe';
export declare class CardController {
    private readonly cardService;
    constructor(cardService: CardService);
    upload(file: PngChunk[]): string;
}
