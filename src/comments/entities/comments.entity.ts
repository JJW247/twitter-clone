import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Common } from 'src/common/entities/common.entity';
import { Tweets } from 'src/tweets/entities/tweets.entity';
import { Users } from 'src/users/entities/users.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Comments extends Common {
  @ApiProperty({
    example: 'Have a nice day!',
    description: 'comment',
  })
  @IsString()
  @IsNotEmpty()
  @Column('varchar')
  comment: string;

  @ManyToOne(() => Users, (users) => users.comments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  users: Users;

  @ManyToOne(() => Tweets, (tweets) => tweets.comments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  tweets: Tweets;
}
