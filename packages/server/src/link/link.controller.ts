import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { CommonException } from 'src/common/response/common.response';
import { SaveApiKeyDTO } from './link.dto';
import { LinkService } from './link.service';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get('/config')
  getConfig() {
    return this.linkService.getLinkInfoList();
  }

  /**
   * 根据配置ID获取模型列表
   * @param id 配置ID
   * @returns
   */
  @Get('/models/')
  getModels(@Query('id') id: string) {
    return this.linkService.getModels(id);
  }

  @Put('/saveUrl')
  saveUrl(@Body('url') url: string, @Body('id') id: string) {
    if (!url) {
      throw CommonException.parameterInvalid('url');
    }
    return this.linkService.saveUrl(id || '', url);
  }

  @Put('/saveCurrentModel')
  saveCurrentModel(@Body('id') id: string, @Body('model') model: string) {
    return this.linkService.saveCurrentModel(id, model);
  }

  @Put('/saveApiKey')
  saveApiKey(@Body() data: SaveApiKeyDTO) {
    return this.linkService.saveApiKey(data.id, data.key);
  }
}
