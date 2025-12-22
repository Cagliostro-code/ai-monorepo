import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ModelService } from './model.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10_000,
    }),
  ],
  exports: [HttpModule],
})
export class CommonHttpModule {}

@Module({
  imports: [CommonHttpModule],
  providers: [ModelService],
  exports: [ModelService],
})
export class ModelHttpModule {}
