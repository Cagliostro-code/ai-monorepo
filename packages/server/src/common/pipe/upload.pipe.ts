import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CharacterCardValidationPipe implements PipeTransform {
  private readonly maxSize: number; // in bytes
  private readonly allowedMimeTypes: string[];

  constructor(
    maxSize: number = 1024 * 1024 * 50, // 默认50MB
    allowedMimeTypes: string[] = ['image/png'],
  ) {
    this.maxSize = maxSize;
    this.allowedMimeTypes = allowedMimeTypes;
  }

  transform(value: unknown): Express.Multer.File {
    // 检查文件是否存在并且是对象类型
    if (!value || !(value instanceof Object) || !('mimetype' in value) || !('size' in value)) {
      throw new BadRequestException('Invalid file object');
    }

    // 类型断言之前先检查必要的属性
    const file = value as {
      mimetype: string;
      size: number;
      [key: string]: any;
    };

    // 验证文件大小
    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `File size exceeds the maximum allowed size of ${this.maxSize} bytes`,
      );
    }

    // 验证文件类型
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types are: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    // 返回验证后的文件对象
    return value as Express.Multer.File;
  }
}

export interface PngChunk {
  type: string;
  data: string | Buffer;
  crc: number;
}

@Injectable()
export class CharacterCardParseChunksPipe implements PipeTransform {
  transform(value: unknown): PngChunk[] {
    if (!value || !(value instanceof Object) || !('buffer' in value)) {
      throw new BadRequestException('Invalid file object');
    }
    const chunks: PngChunk[] = [];
    const buffer = value.buffer as Buffer;
    let offset = 8; // 跳过 PNG 文件头

    while (offset < buffer.length) {
      const length = buffer.readUInt32BE(offset);
      const type = buffer.toString('ascii', offset + 4, offset + 8);
      const dataBuffer = buffer.slice(offset + 8, offset + 8 + length);
      const crc = buffer.readUInt32BE(offset + 8 + length);

      switch (type) {
        case 'IHDR':
        case 'IDAT':
        case 'IEND':
          break;
        default:
          break;
      }

      let data: string | Buffer;

      if (!['IHDR', 'IDAT', 'IEND'].includes(type)) {
        try {
          // 尝试解析 JSON
          data = dataBuffer.toString('utf-8');
          if (data.startsWith('chara')) {
            // 移除 'chara' 前缀并处理 base64 数据
            const base64Data: string = data.substring(5); // 移除 'chara' 前缀
            const jsonString: string = Buffer.from(base64Data, 'base64').toString('utf-8');
            const jsonData: unknown = JSON.parse(jsonString);
            data = jsonData as string | Buffer;
          }
          console.log(data);
        } catch {
          // 如果不是 JSON，保持原始 Buffer
          data = dataBuffer;
        }
        chunks.push({ type, data, crc });
      }

      offset += 8 + length + 4;
    }

    return chunks;
  }
}
