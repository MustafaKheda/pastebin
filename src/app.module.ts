import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { PasteService } from './pastes/paste.service';
import { PasteController } from './pastes/paste.controller';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { ViewController } from './view/view.controller';

  @Module({
    imports: [RedisModule, ConfigModule.forRoot({
      isGlobal: true,
    }),],
    controllers: [PasteController, HealthController,ViewController],
    providers: [PasteService],
  })
  export class AppModule { }
