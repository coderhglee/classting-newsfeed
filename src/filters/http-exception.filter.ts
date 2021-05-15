import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { isObject } from 'class-validator';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const body = this.createMessageBody(exception, status, request);

    response.status(status).json(body);
  }

  private createMessageBody(
    exception: HttpException,
    status: number,
    request: Request,
  ) {
    const res = exception.getResponse();
    return isObject(res)
      ? {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: exception.message,
          ...res,
        }
      : res;
  }
}
