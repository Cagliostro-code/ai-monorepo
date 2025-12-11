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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const card_service_1 = require("./card.service");
const platform_express_1 = require("@nestjs/platform-express");
const upload_pipe_1 = require("../common/pipe/upload.pipe");
let CardController = class CardController {
    cardService;
    constructor(cardService) {
        this.cardService = cardService;
    }
    upload(file) {
        console.log(file);
        return this.cardService.getHello();
    }
};
exports.CardController = CardController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_2.UploadedFile)(new upload_pipe_1.CharacterCardValidationPipe(), new upload_pipe_1.CharacterCardParseChunksPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", String)
], CardController.prototype, "upload", null);
exports.CardController = CardController = __decorate([
    (0, common_1.Controller)('card'),
    __metadata("design:paramtypes", [card_service_1.CardService])
], CardController);
//# sourceMappingURL=card.controller.js.map