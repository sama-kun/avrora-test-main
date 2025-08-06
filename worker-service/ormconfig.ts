import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

// Загружаем переменные из .env файла
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

// Логирование данных о базе
console.log(
  `Using PostgreSQL database ${process.env.DB_NAME} at ${process.env.DB_HOST}:${process.env.DB_PORT}`,
);

export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432') || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: process.env.NODE_ENV !== 'development',
  migrations: ['src/database/migrations/**/*.ts'], // Путь к миграциям
  subscribers: ['src/database/subscribers/**/*.subscriber.ts'], // Путь к подписчикам (если нужны)
  cli: {
    entitiesDir: 'src/modules/', // Где находятся сущности
    migrationsDir: 'src/database/migrations/', // Путь к миграциям
    seedsDir: 'src/database/seeds/', // Путь для сидов
  },
  ssl: process.env.DB_SSL === 'true' || false, // Проверка на использование SSL
} as DataSourceOptions);
