import { Common } from 'src/common/entities/common.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Follows extends Common {
  @ManyToOne(() => Users, (users) => users.followers)
  @JoinColumn()
  follower: Users;

  @ManyToOne(() => Users, (users) => users.followings)
  @JoinColumn()
  following: Users;
}
