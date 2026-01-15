
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from '@nestjs/common';
import type { ClassConstructor, } from 'class-transformer';
import  {  plainToInstance, } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    message:string
    data: T;
}

export const TransformPostResponse = <T>(dtoClass:ClassConstructor<T>)=>{
    return UseInterceptors(new PostTransformInterceptor(dtoClass))
}

@Injectable()
export class PostTransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private readonly dtoClass:ClassConstructor<T>) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => {
        
        return {
            message:'success',
            data:plainToInstance(this.dtoClass,data,{
            excludeExtraneousValues:true
        })
        }
    }));
  }
}
