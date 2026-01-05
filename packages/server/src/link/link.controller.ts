import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { LinkService } from './link.service';
import { SaveApiKeyDTO } from './link.dto';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get('/models')
  getModels(@Query('customUrl') customUrl: string) {
    return this.linkService.getModels(
      customUrl,
      'sk-ocEhYdUR04KlnjCSDf1d55589722476791BbB7779075F2Df',
    );
  }

  @Post('/saveApiKey')
  saveApiKey(@Body() data: SaveApiKeyDTO): string {
    console.log('[ data ] >', data);
    this.linkService.saveApiKey(data.id, data.key);

    return 'Hello World!';
  }
}
