import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
    getHello(){
        return "Hello david welcome to nestJs";
    }

    getDynamicName(name:string) {
        return `${name}, welcome to your application `
    }

    getQueryName(name:string) {
        return `${name}, this is the query parameter `
    }
}
