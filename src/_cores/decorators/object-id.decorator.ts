import { Transform } from "class-transformer"

export const ObjectId = () =>{
    return Transform(({obj})=>obj._id.toString())
}