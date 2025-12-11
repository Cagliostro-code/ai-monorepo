import { PipeTransform } from '@nestjs/common';
export declare class CharacterCardValidationPipe implements PipeTransform {
    private readonly maxSize;
    private readonly allowedMimeTypes;
    constructor(maxSize?: number, allowedMimeTypes?: string[]);
    transform(value: unknown): Express.Multer.File;
}
export interface PngChunk {
    type: string;
    data: string | Buffer;
    crc: number;
}
export declare class CharacterCardParseChunksPipe implements PipeTransform {
    transform(value: unknown): PngChunk[];
}
