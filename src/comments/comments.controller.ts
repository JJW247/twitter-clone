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
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateResult } from 'typeorm';
import { CommentsService } from './comments.service';
import {
  CreateCommentInputDto,
  CreateCommentOutputDto,
} from './dtos/createComment.dto';
import { GetCommentsOutputDto } from './dtos/getComments.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Create comment' })
  @ApiOkResponse({
    type: CreateCommentOutputDto,
  })
  @ApiParam({ name: 'tweetsId', example: '1', description: 'tweetsId' })
  @UseGuards(JwtAuthGuard)
  @Post('tweets/:tweetsId')
  async createComment(
    @Req() req: Request,
    @Param() param: { tweetsId: string },
    @Body() createCommentInputDto: CreateCommentInputDto,
  ): Promise<CreateCommentOutputDto> {
    return await this.commentsService.createComment(
      req,
      param,
      createCommentInputDto,
    );
  }

  @ApiOperation({ summary: 'Get all comments' })
  @ApiOkResponse({
    type: [GetCommentsOutputDto],
  })
  @ApiParam({ name: 'tweetsId', example: '1', description: 'tweetsId' })
  @Get('tweets/:tweetsId')
  async getComments(
    @Param() param: { tweetsId: string },
  ): Promise<GetCommentsOutputDto[]> {
    return await this.commentsService.getComments(param);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @ApiOkResponse({
    type: UpdateResult,
  })
  @ApiParam({ name: 'commentId', example: '1', description: 'commentId' })
  @UseGuards(JwtAuthGuard)
  @Delete(':commentsId')
  async deleteComment(
    @Req() req,
    @Param() param: { commentsId: string },
  ): Promise<UpdateResult> {
    return await this.commentsService.deleteComment(req, param);
  }
}
