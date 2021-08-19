import { PickType } from '@nestjs/swagger';
import { Comments } from '../entities/comments.entity';

export class GetCommentsOutputDto extends PickType(Comments, [
  'id',
  'createdAt',
  'comment',
  'users',
] as const) {}
