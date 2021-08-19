import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/createComment.dto';
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
    createCommentDto: CreateCommentDto,
  ) {
    return await this.commentsRepository.save({
      comment: createCommentDto.comment,
      tweets: {
        id: +param.tweetsId,
      },
      users: req.user,
    });
  }

  async getComments(param: { tweetsId: string }) {
    return await this.commentsRepository.find({
      where: {
        tweets: {
          id: param.tweetsId,
        },
      },
      select: ['id', 'createdAt', 'comment', 'users'],
    });
  }

  async deleteComment(req: Request, param: { commentsId: string }) {
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
