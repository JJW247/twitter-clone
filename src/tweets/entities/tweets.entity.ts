import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Common } from 'src/common/entities/common.entity';
import { Likes } from 'src/likes/entities/likes.entity';
import { Users } from 'src/users/entities/users.entity';
import { Comments } from 'src/comments/entities/comments.entity';

@Entity()
export class Tweets extends Common {
  @Column('varchar')
  tweet: string;

  @ManyToOne(() => Users, (users) => users.tweets, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  users: Users;

  @OneToMany(() => Likes, (likes) => likes.users)
  likes: Likes[];

  @OneToMany(() => Comments, (comments) => comments.tweets)
  comments: Comments[];
}
