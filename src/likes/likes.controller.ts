import { Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Likes } from './entities/likes.entity';
import { LikesService } from './likes.service';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({ summary: 'Toggle tweet like' })
  @ApiOkResponse({
    description: 'like or dislike',
  })
  @ApiParam({
    name: 'tweetsId',
    example: 'http://localhost:3010/likes/tweets/22',
    description: 'tweetsId',
  })
  @UseGuards(JwtAuthGuard)
  @Put('tweets/:tweetsId')
  async likeTweet(
    @Req() req,
    @Param() param: { tweetsId: string },
  ): Promise<Likes> {
    return await this.likesService.likeTweet(req, param);
  }

  @ApiOperation({ summary: 'Get tweet likes count' })
  @ApiOkResponse({
    type: Number,
  })
  @ApiParam({
    name: 'tweetsId',
    example: 'http://localhost:3010/likes/tweets',
    description: 'tweetsId',
  })
  @Get('count/tweets/:tweetsId')
  async getTweetLikesCount(
    @Param() param: { tweetsId: string },
  ): Promise<number> {
    return await this.likesService.getTweetLikesCount(param);
  }

  @ApiOperation({ summary: 'Get tweet like or dislike status' })
  @ApiOkResponse({
    type: Boolean,
  })
  @ApiParam({
    name: 'tweetsId',
    example: 'http://localhost:3010/likes/tweets/islike/10',
    description: 'tweetsId',
  })
  @UseGuards(JwtAuthGuard)
  @Get('islike/tweets/:tweetsId')
  async getTweetIsLike(
    @Req() req,
    @Param() param: { tweetsId: string },
  ): Promise<Likes> {
    return await this.likesService.getTweetIsLike(req, param);
  }
}
