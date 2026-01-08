import { Body, Controller, Put, Get, Query } from '@nestjs/common';
import { LinkService } from './link.service';
import { SaveApiKeyDTO } from './link.dto';
import { CommonException } from 'src/common/response/common.response';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get('/models/')
  getModels(@Query('id') id: string) {
    console.log('[ id ] >', id);
    return this.linkService.getModels(id);
  }

  @Put('/saveUrl')
  saveUrl(@Body('url') url: string, @Body('id') id: string) {
    if (!url) {
      return CommonException.parameterInvalid('url');
    }
    return this.linkService.saveUrl(id || '', url);
  }

  @Put('/saveApiKey')
  saveApiKey(@Body() data: SaveApiKeyDTO) {
    return this.linkService.saveApiKey(data.id, data.key);
  }
}
