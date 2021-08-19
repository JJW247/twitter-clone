import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Likes } from './entities/likes.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Likes])],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
