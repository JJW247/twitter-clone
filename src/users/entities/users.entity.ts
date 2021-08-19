import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

import { Common } from 'src/common/entities/common.entity';
import { Tweets } from 'src/tweets/entities/tweets.entity';
import { Likes } from 'src/likes/entities/likes.entity';
import { Comments } from 'src/comments/entities/comments.entity';

@Entity()
export class Users extends Common {
  @ApiProperty({
    example: 'h662hong@gmail.com',
    description: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  @Column('varchar', { unique: true })
  email: string;

  @ApiProperty({
    example: 'h662',
    description: 'nickname',
  })
  @IsString()
  @Length(2, 10)
  @IsNotEmpty()
  @Column('varchar')
  nickname: string;

  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { select: false })
  password: string;

  @OneToMany(() => Tweets, (tweets) => tweets.users)
  tweets: Tweets[];

  @OneToMany(() => Likes, (likes) => likes.users)
  likes: Likes[];

  @OneToMany(() => Comments, (comments) => comments.users)
  comments: Comments[];
}
