import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Common } from 'src/common/entities/common.entity';
import { Tweets } from 'src/tweets/entities/tweets.entity';
import { Users } from 'src/users/entities/users.entity';

@Entity()
export class Likes extends Common {
  @Column('boolean', { default: true })
  like: boolean;

  @ManyToOne(() => Users, (users) => users.likes, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  users: Users;

  @ManyToOne(() => Tweets, (tweets) => tweets.likes, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  tweets?: Tweets;
}
