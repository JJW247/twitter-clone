import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from 'src/users/entities/users.entity';
import { Tweets } from '../entities/tweets.entity';

export class CreateTweetInputDto extends PickType(Tweets, ['tweet'] as const) {}

export class CreateTweetOutputDto extends PickType(Tweets, ['tweet'] as const) {
  @ApiProperty({
    example: '1',
    description: 'userId',
  })
  users: Users;
}
