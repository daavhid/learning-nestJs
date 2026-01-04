import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.service';

@Injectable()
export class HelloService {
    constructor(private configService:ConfigService){}
    getHello(){
        
        return "Hello david welcome to ";
    }

    getHelloMessage(name:string){
        const appName = this.configService.get<string>('APP_NAME')
        return `${name}, welcome to ${appName} `
    }

    getDynamicName(name:string) {
        return `${name}, welcome to your application `
    }

    getQueryName(name:string) {
        return `${name}, this is the query parameter `
    }
}
