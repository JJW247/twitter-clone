import { PickType } from '@nestjs/swagger';
import { TokenDto } from 'src/common/dtos/common.dto';
import { Users } from '../entities/users.entity';

export class LoginInputDto extends PickType(Users, [
  'email',
  'password',
] as const) {}

export class LoginOutputDto extends TokenDto {}
