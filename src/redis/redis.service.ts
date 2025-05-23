import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import redisConfig from './config/redis.config';

@Injectable()
export class RedisService {
  private client: RedisClientType;
  constructor(
    @Inject(redisConfig.KEY)
    private readonly redisConfigService: ConfigType<typeof redisConfig>,
  ) {}

  async onModuleInit() {
    this.client = createClient({
      url: this.redisConfigService.REDIS_URL,
    });
    this.client.on('error', (err) => {
      console.error('Redis Client Error', err);
    })
    await this.client.connect()
    console.log("redis connected")
  }
  
}
