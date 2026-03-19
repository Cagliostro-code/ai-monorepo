import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { LinkConfigService } from './link-config.service';

import { Module } from '@nestjs/common';
import { ModelHttpModule } from 'src/common/http/index.module';

@Module({
  imports: [ModelHttpModule],
  controllers: [LinkController],
  providers: [LinkService, LinkConfigService],
  exports: [LinkConfigService],
})
export class LinkModule {}
