import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Likes } from './entities/likes.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,
    private readonly usersService: UsersService,
  ) {}

  async likeTweet(req: Request, param: { tweetsId: string }) {
    const like = await this.likesRepository.findOne({
      where: {
        tweets: { id: param.tweetsId },
        users: req.user,
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

  async getTweetLikes(param: { tweetsId: string }) {
    return this.likesRepository.count({
      where: { tweets: { id: param.tweetsId } },
    });
  }

  async getTweetIsLike(req: Request, param: { tweetsId: string }) {
    return this.likesRepository.findOne({
      where: {
        tweets: { id: param.tweetsId },
        users: req.user,
      },
      select: ['like'],
    });
  }
}
