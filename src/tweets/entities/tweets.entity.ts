import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Common } from 'src/common/entities/common.entity';
import { Likes } from 'src/likes/entities/likes.entity';
import { Users } from 'src/users/entities/users.entity';
import { Comments } from 'src/comments/entities/comments.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Tweets extends Common {
  @ApiProperty({
    example: 'Hello, world!',
    description: 'tweet message',
  })
  @IsString()
  @IsNotEmpty()
  @Column('varchar')
  tweet: string;

  @ManyToOne(() => Users, (users) => users.tweets, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  users: Users;

  @OneToMany(() => Likes, (likes) => likes.tweets, {
    cascade: ['soft-remove'],
  })
  likes: Likes[];

  @OneToMany(() => Comments, (comments) => comments.tweets, {
    cascade: ['soft-remove'],
  })
  comments: Comments[];
}
