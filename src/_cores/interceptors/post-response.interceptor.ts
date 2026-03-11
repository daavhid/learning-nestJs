import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import type { ClassConstructor } from 'class-transformer';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationMetaData } from 'src/common/interface/pagination.interface';

export interface Response<T> {
  message: string;
  data: T;
  meta: PaginationMetaData;
}

export const TransformPostResponse = <T>(dtoClass: ClassConstructor<T>) => {
  return UseInterceptors(new PostTransformInterceptor(dtoClass));
};

@Injectable()
export class PostTransformInterceptor<T> implements NestInterceptor<
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
        return {
          message: 'success',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          data: plainToInstance(this.dtoClass, data.data, {
            excludeExtraneousValues: true,
          }),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          meta: data.meta,
        };
      }),
    );
  }
}
