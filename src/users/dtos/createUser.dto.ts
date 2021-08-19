import { PickType } from '@nestjs/swagger';
import { TokenDto } from 'src/common/dtos/common.dto';
import { Users } from '../entities/users.entity';

export class CreateUserInputDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {}

export class CreateUserOutputDto extends TokenDto {}
