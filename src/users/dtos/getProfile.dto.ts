import { PickType } from '@nestjs/swagger';
import { Users } from '../entities/users.entity';

export class GetProfileOutputDto extends PickType(Users, [
  'id',
  'nickname',
  'introduce',
  'followers',
  'followings',
  'tweets',
] as const) {}
