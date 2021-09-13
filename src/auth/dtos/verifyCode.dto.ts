import { PickType } from '@nestjs/swagger';
import { Users } from 'src/users/entities/users.entity';

export class VerifyCodeInputDto extends PickType(Users, [
  'email',
  'verifyCode',
] as const) {}
