import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/createComment.dto';
import { Comments } from './entities/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    private readonly usersService: UsersService,
  ) {}

  async createComment(
    req,
    param: { tweetsId: string },
    createCommentDto: CreateCommentDto,
  ) {
    const me = await this.usersService.getMe(req);

    return await this.commentsRepository.save({
      comment: createCommentDto.comment,
      tweets: {
        id: +param.tweetsId,
      },
      users: {
        id: me.userId,
      },
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

  async deleteComment(req, param: { commentsId: string }) {
    const me = await this.usersService.getMe(req);

    const comment = await this.commentsRepository.findOne({
      where: {
        id: param.commentsId,
        users: {
          id: me.userId,
        },
      },
    });

    if (!comment) throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);

    return await this.commentsRepository.softDelete({ id: +param.commentsId });
  }
}
