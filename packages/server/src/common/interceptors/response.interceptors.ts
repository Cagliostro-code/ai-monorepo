// common/interceptors/response.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map, of, throwError } from 'rxjs';
import { CommonException } from '../response/common.response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      // 正常返回
      map(data => {
        return {
          code: 0,
          message: 'success',
          data,
        };
      }),
      // 捕获异常
      catchError(error => {
        // 业务异常 / HttpException
        if (error instanceof CommonException) {
          return of({
            message: error.message || '请求失败',
            code: error.code,
            data: null,
            success: false,
          });
        }

        // 未知异常
        return throwError(() => ({
          code: 500,
          message: '系统异常',
          data: null,
        }));
      }),
    );
  }
}
