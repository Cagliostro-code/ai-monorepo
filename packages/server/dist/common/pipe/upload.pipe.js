"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterCardParseChunksPipe = exports.CharacterCardValidationPipe = void 0;
const common_1 = require("@nestjs/common");
let CharacterCardValidationPipe = class CharacterCardValidationPipe {
    maxSize;
    allowedMimeTypes;
    constructor(maxSize = 1024 * 1024 * 50, allowedMimeTypes = ['image/png']) {
        this.maxSize = maxSize;
        this.allowedMimeTypes = allowedMimeTypes;
    }
    transform(value) {
        if (!value || !(value instanceof Object) || !('mimetype' in value) || !('size' in value)) {
            throw new common_1.BadRequestException('Invalid file object');
        }
        const file = value;
        if (file.size > this.maxSize) {
            throw new common_1.BadRequestException(`File size exceeds the maximum allowed size of ${this.maxSize} bytes`);
        }
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Invalid file type. Allowed types are: ${this.allowedMimeTypes.join(', ')}`);
        }
        return value;
    }
};
exports.CharacterCardValidationPipe = CharacterCardValidationPipe;
exports.CharacterCardValidationPipe = CharacterCardValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Number, Array])
], CharacterCardValidationPipe);
let CharacterCardParseChunksPipe = class CharacterCardParseChunksPipe {
    transform(value) {
        if (!value || !(value instanceof Object) || !('buffer' in value)) {
            throw new common_1.BadRequestException('Invalid file object');
        }
        const chunks = [];
        const buffer = value.buffer;
        let offset = 8;
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
            let data;
            if (!['IHDR', 'IDAT', 'IEND'].includes(type)) {
                try {
                    data = dataBuffer.toString('utf-8');
                    if (data.startsWith('chara')) {
                        const base64Data = data.substring(5);
                        const jsonString = Buffer.from(base64Data, 'base64').toString('utf-8');
                        const jsonData = JSON.parse(jsonString);
                        data = jsonData;
                    }
                    console.log(data);
                }
                catch {
                    data = dataBuffer;
                }
                chunks.push({ type, data, crc });
            }
            offset += 8 + length + 4;
        }
        return chunks;
    }
};
exports.CharacterCardParseChunksPipe = CharacterCardParseChunksPipe;
exports.CharacterCardParseChunksPipe = CharacterCardParseChunksPipe = __decorate([
    (0, common_1.Injectable)()
], CharacterCardParseChunksPipe);
//# sourceMappingURL=upload.pipe.js.map