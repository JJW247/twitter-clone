import { Controller, Get, Param, Put, Req } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Put('tweets/:tweetsId')
  async likeTweet(@Req() req, @Param() param: { tweetsId: string }) {
    return await this.likesService.likeTweet(req, param);
  }

  @Get('tweets/:tweetsId')
  async getTweetLikes(@Param() param: { tweetsId: string }) {
    return await this.likesService.getTweetLikes(param);
  }

  @Get('tweets/islike/:tweetsId')
  async getTweetIsLike(@Req() req, @Param() param: { tweetsId: string }) {
    return await this.likesService.getTweetIsLike(req, param);
  }
}
