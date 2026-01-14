import { Expose } from "class-transformer";

export class ResponseDto {
    @Expose()
    name:string;

    @Expose()
    email:string;

    @Expose()
    _id:string

    @Expose()
    role:'user' | 'admin'
}