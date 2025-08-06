import {
  BadRequestException,
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import RateLimit from 'express-rate-limit';
import * as packages from '../package.json';
import { AppModule } from './app/app.module';
import {
  AnyExceptionFilter,
  HttpExceptionFilter,
} from './common/filters/HttpException.filter';
import {
  LoggingInterceptor,
  TransformInterceptor,
} from './common/interceptors';

dotenv.config();

async function bootstrap() {
  const logger = new Logger(packages.name);
  logger.log(`Application [${packages.name}] is starting...`);
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  await app.listen(process.env.PORT);
  // app.use(new LoggingMiddleware(app.get('winston')).use);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.useLogger(logger);

  app.useGlobalFilters(new AnyExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
    new LoggingInterceptor(),
  );

  app.use(
    RateLimit({
      windowMs: 60 * 1000, // 1 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      handler: (request, response) => {
        return response.status(501).send({
          error: {
            message: 'Too many requests. Please keep calm and get slow down.',
            details: `More then 1000 requests in last minute from your IP`,
          },
        });
      },
    }),
  );

  console.log(`
  ${packages.name} ver ${packages.version} by Samgar Seriknur @lieproger
  Started at lo http://localhost:3000
  NODE_ENV=${process.env.NODE_ENV}
  `);
}
bootstrap().catch((e) => {
  throw new Error(e);
});
