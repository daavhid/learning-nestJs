import { Expose } from "class-transformer";
import { ObjectId } from "src/_cores/decorators/object-id.decorator";

export class ResponseDto {
    @Expose()
    name:string;

    @Expose()
    email:string;

    @Expose()
    @ObjectId()
    _id:string

    @Expose()
    role:'user' | 'admin'
}