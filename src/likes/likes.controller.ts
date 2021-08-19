import { Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Put('tweets/:tweetsId')
  async likeTweet(@Req() req, @Param() param: { tweetsId: string }) {
    return await this.likesService.likeTweet(req, param);
  }

  @Get('tweets/:tweetsId')
  async getTweetLikes(@Param() param: { tweetsId: string }) {
    return await this.likesService.getTweetLikes(param);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tweets/islike/:tweetsId')
  async getTweetIsLike(@Req() req, @Param() param: { tweetsId: string }) {
    return await this.likesService.getTweetIsLike(req, param);
  }
}
