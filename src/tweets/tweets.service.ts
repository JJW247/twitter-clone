import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateTweetDto } from './dtos/createTweet.dto';
import { Tweets } from './entities/tweets.entity';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweets)
    private readonly tweetsRepository: Repository<Tweets>,
    private readonly usersService: UsersService,
  ) {}

  async createTweet(req: Request, createTweetDto: CreateTweetDto) {
    return await this.tweetsRepository.save({
      ...createTweetDto,
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
      .take(10)
      .skip(query.page ? query.page * 10 : 0)
      .getMany();
  }

  async deleteTweet(req, param: { tweetsId: string }) {
    const me = await this.usersService.getMe(req);

    const tweet = await this.tweetsRepository.findOne({
      where: {
        id: param.tweetsId,
        users: {
          id: me.userId,
        },
      },
    });

    if (!tweet) throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    return await this.tweetsRepository.softDelete({ id: +param.tweetsId });
  }
}
