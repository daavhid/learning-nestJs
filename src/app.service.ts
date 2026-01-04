import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService:ConfigService){}
  getHello(): string {
    const appName = this.configService.get('APP_NAME')
    console.log(appName,'appName')
    return `Hello from ${appName}`;
  }
}
