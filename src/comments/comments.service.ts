import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository, UpdateResult } from 'typeorm';
import {
  CreateCommentInputDto,
  CreateCommentOutputDto,
} from './dtos/createComment.dto';
import { GetCommentsOutputDto } from './dtos/getComments.dto';
import { Comments } from './entities/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
  ) {}

  async createComment(
    req: Request,
    param: { tweetsId: string },
    createCommentInputDto: CreateCommentInputDto,
  ): Promise<CreateCommentOutputDto> {
    return await this.commentsRepository.save({
      comment: createCommentInputDto.comment,
      tweets: {
        id: +param.tweetsId,
      },
      users: req.user,
    });
  }

  async getComments(param: {
    tweetsId: string;
  }): Promise<GetCommentsOutputDto[]> {
    return await this.commentsRepository
      .createQueryBuilder('comments')
      .leftJoin('comments.users', 'users')
      .leftJoin('comments.tweets', 'tweets')
      .where('tweets.id = :tweetsId', { tweetsId: param.tweetsId })
      .select([
        'comments.id',
        'comments.comment',
        'comments.createdAt',
        'users.id',
        'users.nickname',
      ])
      .orderBy('comments.createdAt', 'DESC')
      .getMany();
  }

  async getCommentsCount(param: { tweetsId: string }): Promise<number> {
    return this.commentsRepository.count({
      where: { tweets: { id: param.tweetsId } },
    });
  }

  async deleteComment(
    req: Request,
    param: { commentsId: string },
  ): Promise<UpdateResult> {
    const comment = await this.commentsRepository.findOne({
      where: {
        id: param.commentsId,
        users: req.user,
      },
    });

    if (!comment) throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    return await this.commentsRepository.softDelete({ id: +param.commentsId });
  }
}
