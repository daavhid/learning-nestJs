import { Injectable } from '@nestjs/common';


@Injectable()
export class AppService {
  constructor(){}
  getHello(): string {
    const appName =process.env.APP_NAME || "das";
    console.log(appName,'appName')
    return `Hello from ${appName}`;
  }
}
