export const REDIS_CLIENT_SERVICE = 'REDIS_CLIENT_SERVICE';

export interface RedisClientServiceInterface {
  set(key: string, value: string, expiresInSec?: number): Promise<void>;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
}
