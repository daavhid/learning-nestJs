import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationMetaData } from 'src/common/interface/pagination.interface';

export interface Response<T> {
  message: string;
  data?: T;
  meta?: PaginationMetaData;
}

// create a custom decorator for reusing the dto class in the interceptor

export function TransformDto<T>(dtoClass: ClassConstructor<T>) {
  return UseInterceptors(new TransformInterceptor<T>(dtoClass));
}

export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  constructor(private readonly dtoClass: ClassConstructor<T>) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          return {
            message: 'success',
          };
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const Data = data?.meta ? data.data : data;
        const responseData: Response<T> = {
          message: 'success',
          data: plainToInstance(this.dtoClass, Data, {
            excludeExtraneousValues: true,
          }),
        };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (data.meta) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          responseData.meta = data.meta;
        }
        return responseData;
      }),
    );
  }
}
