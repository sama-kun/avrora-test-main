import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.response.message
      ? typeof exception.response.message === 'string'
        ? exception.response.message
        : exception.response.message.join(', ')
      : exception.message || 'Unknown error';
    const stack = exception.stack;

    try {
      const error = {
        message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        body: request.body,
        params: request.params,
        query: request.query,
        headers: request.headers,
        cookies: request.cookies,
        stack,
      };
      if (response.status)
        response.status(status).json({
          error,
        });
      else response.json({ error });
    } catch (e) {
      Logger.error(e);
    }
  }
}

@Catch()
export class AnyExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse
      ? ctx.getResponse<Response>()
      : ({} as Response);
    const request = ctx.getRequest
      ? ctx.getRequest<Request>()
      : ({} as Request);
    const status = exception.getStatus ? exception.getStatus() : 500;
    const message = exception?.response?.message
      ? exception?.response?.message.toString()
      : false || response?.message?.join
      ? response?.message.toString()
      : false || response?.message
      ? response?.message
      : false || exception?.message || 'Unknown error';
    const stack = exception.stack || '';

    if (response.status) {
      response.status(status).json({
        error: {
          message: message,
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request?.url || '',
          body: request?.body || '',
          params: request?.params || '',
          query: request?.query || '',
          headers: request?.headers || '',
          cookies: request?.cookies || '',
          stack: stack,
        },
      });
    } else
      console.error({
        error: {
          message: message,
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request?.url || '',
          body: request?.body || '',
          params: request?.params || '',
          query: request?.query || '',
          headers: request?.headers || '',
          cookies: request?.cookies || '',
          stack: stack,
        },
      });
  }
}
