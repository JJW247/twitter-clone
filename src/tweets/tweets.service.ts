import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Comments } from 'src/comments/entities/comments.entity';
import { Likes } from 'src/likes/entities/likes.entity';
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
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,
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

  async getProfileTweets(query, param: { userId: string }) {
    return await this.tweetsRepository
      .createQueryBuilder('tweets')
      .leftJoin('tweets.users', 'users')
      .where('users.id = :userId', { userId: param.userId })
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
      select: ['id'],
      where: {
        id: param.tweetsId,
        users: req.user,
      },
    });
    const remove = await this.tweetsRepository.softRemove(tweet);

    if (!remove.deletedAt) {
      throw new HttpException('삭제 실패', HttpStatus.BAD_REQUEST);
    }

    const result = new UpdateResult();

    result.affected = 1;

    return result;

    // if (!tweet)
    //   throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    // const comments = await this.commentsRepository.find({
    //   where: {
    //     tweets: {
    //       id: tweet.id,
    //     },
    //   },
    // });
    // const likes = await this.likesRepository.find({
    //   where: {
    //     tweets: {
    //       id: tweet.id,
    //     },
    //   },
    // });

    // if (comments.length !== 0) {
    //   await Promise.all(
    //     comments.map((comment) =>
    //       this.commentsRepository.softDelete({ id: comment.id }),
    //     ),
    //   );
    // }
    // if (likes.length !== 0) {
    //   await Promise.all(
    //     likes.map((like) => this.likesRepository.softDelete({ id: like.id })),
    //   );
    // }

    // return await this.tweetsRepository.softDelete(tweet);
  }
}
