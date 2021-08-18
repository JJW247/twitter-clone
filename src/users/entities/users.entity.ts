import { Column, Entity, OneToMany } from 'typeorm';

import { Common } from 'src/common/entities/common.entity';
import { Tweets } from 'src/tweets/entities/tweets.entity';
import { Likes } from 'src/likes/entities/likes.entity';

@Entity()
export class Users extends Common {
  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar')
  nickname: string;

  @Column('varchar', { select: false })
  password: string;

  @OneToMany(() => Tweets, (tweets) => tweets.tweet)
  tweets: Tweets[];

  @OneToMany(() => Likes, (likes) => likes.like)
  likes: Likes[];
}
