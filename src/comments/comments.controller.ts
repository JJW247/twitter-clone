import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/createComment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('tweets/:tweetsId')
  async createComment(
    @Req() req,
    @Param() param: { tweetsId: string },
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentsService.createComment(
      req,
      param,
      createCommentDto,
    );
  }

  @Get('tweets/:tweetsId')
  async getComments(@Param() param: { tweetsId: string }) {
    return await this.commentsService.getComments(param);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentsId')
  async deleteComment(@Req() req, @Param() param: { commentsId: string }) {
    return await this.commentsService.deleteComment(req, param);
  }
}
