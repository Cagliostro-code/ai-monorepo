import { LinkService } from './link.service';
import { LinkController } from './link.controller';

import { Module } from '@nestjs/common';
import { ModelHttpModule } from 'src/common/http/index.module';

@Module({
  imports: [ModelHttpModule],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule {}
