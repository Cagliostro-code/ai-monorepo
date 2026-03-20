import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import type { Response } from 'express';
import { CommonException } from '../response/common.response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();

      if (typeof payload === 'object' && payload !== null && 'code' in payload) {
        return response.status(status).json(payload);
      }

      const message = typeof payload === 'string' ? payload : exception.message;
      return response.status(status).json({
        code: status,
        message,
        data: null,
      });
    }

    if (exception instanceof AxiosError) {
      const status = exception.response?.status;
      const payload = CommonException.externalRequestError(status, exception.message).getResponse();

      return response
        .status(status && status >= 400 && status < 600 ? status : HttpStatus.BAD_GATEWAY)
        .json(payload);
    }

    this.logger.error(exception instanceof Error ? exception.stack : String(exception));

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'System error',
      data: null,
    });
  }
}
