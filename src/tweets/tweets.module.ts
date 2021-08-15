import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweets } from './entities/tweets.entity';
import { TweetsController } from './tweets.controller';
import { TweetsService } from './tweets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tweets])],
  controllers: [TweetsController],
  providers: [TweetsService],
})
export class TweetsModule {}
