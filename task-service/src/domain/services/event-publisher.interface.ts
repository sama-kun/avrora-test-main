export const KAFKA_SERVICE = 'KAFKA_SERVICE';
export const KAFKA_CLIENT = 'KAFKA_CLIENT';

export interface EventPublisherInterface {
  publish<T = unknown>(topic: string, payload: T): Promise<void>;
}
