import { Common } from 'src/common/entities/common.entity';
import { Users } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Tweets extends Common {
  @Column('varchar')
  tweet: string;

  @ManyToOne(() => Users, (users) => users.tweets)
  user: Users;
}
