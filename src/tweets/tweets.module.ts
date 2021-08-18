import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Tweets } from './entities/tweets.entity';
import { TweetsController } from './tweets.controller';
import { TweetsService } from './tweets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tweets]), UsersModule],
  controllers: [TweetsController],
  providers: [TweetsService],
})
export class TweetsModule {}
