import { Common } from 'src/common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Profiles extends Common {
  @Column('varchar', { unique: true })
  filename: string;

  @Column('varchar')
  originalFilename: string;

  @ManyToOne(() => Users, (users) => users.profiles)
  @JoinColumn()
  user: Users;
}
