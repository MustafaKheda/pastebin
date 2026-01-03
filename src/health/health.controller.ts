import { Controller, Get } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Controller('api/healthz')
export class HealthController {
  constructor(private readonly redis: RedisService) { }

  @Get()
  async health() {
    try {
    await this.redis.getClient().ping();
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }
}