import { Column, Entity } from 'typeorm';

import { Common } from 'src/common/entities/common.entity';

@Entity()
export class Users extends Common {
  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar')
  nickname: string;

  @Column('varchar')
  password: string;
}
