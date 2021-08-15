import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { CreateTweetDto } from './dtos/createTweet.dto';
import { Tweets } from './entities/tweets.entity';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweets)
    private readonly tweetsRepository: Repository<Tweets>,
  ) {}

  async createTweet(req: Request, createTweetDto: CreateTweetDto) {
    return await this.tweetsRepository.save({
      ...createTweetDto,
      user: req.user,
    });
  }
}
