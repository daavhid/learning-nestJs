import {  NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    message: string;
    data: T;
}

// create a custom decorator for reusing the dto class in the interceptor

export function TransformDto<T>(dtoClass:ClassConstructor<T>){
    return UseInterceptors(new TransformInterceptor<T>(dtoClass))
}


export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private readonly dtoClass:ClassConstructor<T>){}
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