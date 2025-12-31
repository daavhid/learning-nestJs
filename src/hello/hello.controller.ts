import { Controller, Get, Param, Query } from '@nestjs/common';
import { HelloService } from './hello.service';

@Controller('hello')
export class HelloController {
    constructor(private readonly helloService: HelloService) {}
    @Get()
    getHello() {
        return this.helloService.getHello()
    }

    @Get("users/:name")
    getDynamicName(@Param('name') name:string){
        return this.helloService.getDynamicName(name)

    }
    @Get("query")
    getQueryName(@Query('name') name:string) :string {
        return this.helloService.getQueryName(name)

    }

}
