import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Likes } from './entities/likes.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,
  ) {}

  async likeTweet(req: Request, param: { tweetsId: string }): Promise<Likes> {
    const like = await this.likesRepository.findOne({
      where: {
        users: req.user,
        tweets: { id: param.tweetsId },
      },
    });

    if (!like) {
      return await this.likesRepository.save({
        users: req.user,
        tweets: { id: +param.tweetsId },
      });
    }

    like.like = !like.like;

    return this.likesRepository.save(like);
  }

  async getTweetLikesCount(param: { tweetsId: string }): Promise<number> {
    return this.likesRepository.count({
      where: { tweets: { id: param.tweetsId }, like: true },
    });
  }

  async getTweetIsLike(
    req: Request,
    param: { tweetsId: string },
  ): Promise<Likes> {
    return this.likesRepository.findOne({
      where: {
        tweets: { id: param.tweetsId },
        users: req.user,
      },
      select: ['like'],
    });
  }
}
