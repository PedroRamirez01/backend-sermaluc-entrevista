import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  success: boolean;
  data: T;
  statusCode: number;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data: unknown) => {
        // Check if data is an object and has success property
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          typeof (data as { success: unknown }).success === 'boolean'
        ) {
          return data as Response<T>;
        }

        return {
          success: true,
          data: data as T,
          statusCode: response.statusCode,
        };
      }),
    );
  }
}
