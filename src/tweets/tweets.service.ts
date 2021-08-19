import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository, UpdateResult } from 'typeorm';
import {
  CreateTweetInputDto,
  CreateTweetOutputDto,
} from './dtos/createTweet.dto';
import { Tweets } from './entities/tweets.entity';
import { TWEETS_PAGE } from './tweets.const';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweets)
    private readonly tweetsRepository: Repository<Tweets>,
  ) {}

  async createTweet(
    req: Request,
    createTweetInputDto: CreateTweetInputDto,
  ): Promise<CreateTweetOutputDto> {
    return await this.tweetsRepository.save({
      ...createTweetInputDto,
      users: req.user,
    });
  }

  async getTweets(query) {
    return await this.tweetsRepository
      .createQueryBuilder('tweets')
      .leftJoin('tweets.users', 'users')
      .select([
        'tweets.id',
        'tweets.tweet',
        'tweets.createdAt',
        'users.id',
        'users.nickname',
      ])
      .orderBy('tweets.createdAt', 'DESC')
      .take(TWEETS_PAGE)
      .skip(query.page ? query.page * TWEETS_PAGE : 0)
      .getMany();
  }

  async deleteTweet(
    req: Request,
    param: { tweetsId: string },
  ): Promise<UpdateResult> {
    const tweet = await this.tweetsRepository.findOne({
      where: {
        id: param.tweetsId,
        users: req.user,
      },
    });

    if (!tweet)
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    return await this.tweetsRepository.softDelete({ id: +param.tweetsId });
  }
}
