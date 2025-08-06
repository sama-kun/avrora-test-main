import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class PostgresService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.client = new Client({
      host: this.configService.get('DB_HOST'),
      port: Number(this.configService.get('DB_PORT')),
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.end();
  }

  getClient(): Client {
    return this.client;
  }
}
