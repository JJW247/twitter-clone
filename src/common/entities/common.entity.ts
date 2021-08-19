import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Common {
  @ApiProperty({
    example: 1,
    description: 'id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '2021-08-14 22:28:52.648696',
    description: 'createdAt',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2021-08-14 22:28:52.648696',
    description: 'createdAt',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
