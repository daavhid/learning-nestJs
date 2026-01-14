import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from './sign-up.dto';

export class UpdateAuthDto extends PartialType(SignUpDto) {}
