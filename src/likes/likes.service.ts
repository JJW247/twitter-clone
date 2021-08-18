import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async likeTweet(req, param: { tweetsId: string }) {
    const me = await this.usersService.getMe(req);

    const like = await this.likesRepository.findOne({
      where: {
        tweets: { id: param.tweetsId },
        users: { id: me.userId },
      },
    });

    if (!like) {
      return await this.likesRepository.save({
        users: { id: me.userId },
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

  async getTweetIsLike(req, param: { tweetsId: string }) {
    const me = await this.usersService.getMe(req);

    return this.likesRepository.findOne({
      where: {
        tweets: { id: param.tweetsId },
        users: { id: me.userId },
      },
      select: ['like'],
    });
  }
}
