import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateTweetDto } from './dtos/createTweet.dto';
import { TweetsService } from './tweets.service';

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTweet(@Request() req, @Body() createTweetDto: CreateTweetDto) {
    return await this.tweetsService.createTweet(req, createTweetDto);
  }

  @Get()
  async getTweets(@Query() query) {
    return await this.tweetsService.getTweets(query);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':tweetsId')
  async deleteTweets(@Req() req, @Param() param) {
    return await this.tweetsService.deleteTweet(req, param);
  }
}
