import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';

@Injectable()
export class InitDataService implements OnApplicationBootstrap {
  private readonly logger = new Logger(InitDataService.name);

  onApplicationBootstrap() {
    this.logger.log('Init data service initialized');
  }
}
