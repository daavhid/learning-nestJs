import { SetMetadata } from '@nestjs/common';

export const Route_Key = 'route';
export const Routes = (route: string) => SetMetadata(Route_Key, route);
