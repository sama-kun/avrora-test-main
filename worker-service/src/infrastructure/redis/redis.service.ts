import { RedisClientServiceInterface } from '@/domain/services/redis.interface';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redis from 'redis';

@Injectable()
export class RedisClientService
  implements OnModuleInit, OnModuleDestroy, RedisClientServiceInterface
{
  private readonly logger = new Logger(RedisClientService.name);

  private client: redis.RedisClientType;

  constructor(private configService: ConfigService) {
    this.client = redis.createClient({
      url: this.configService.getOrThrow<string>('REDIS_URL'),
    });
    this.client.on('error', (err: Error) => {
      this.logger.error('Redis client error:', err.message);
    });
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  private async connect() {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
        this.logger.log('Redis client connected successfully.');
      }
    } catch (error) {
      this.logger.error('Error connecting to Redis:', error.message);
    }
  }

  async set(key: string, value: string, expiresInSec?: number): Promise<void> {
    try {
      this.logger.log('Hey');
      if (expiresInSec) {
        await this.client.setEx(key, expiresInSec, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Error setting key "${key}" in Redis:`, error.message);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(
        `Error getting key "${key}" from Redis:`,
        error.message,
      );
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(
        `Error deleting key "${key}" from Redis:`,
        error.message,
      );
    }
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }
}
