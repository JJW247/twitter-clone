import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateResult } from 'typeorm';
import {
  CreateTweetInputDto,
  CreateTweetOutputDto,
} from './dtos/createTweet.dto';
import { Tweets } from './entities/tweets.entity';
import { TWEETS_PAGE } from './tweets.const';
import { TweetsService } from './tweets.service';

@ApiTags('tweets')
@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @ApiOperation({ summary: 'Create tweet' })
  @ApiOkResponse({
    type: CreateTweetOutputDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTweet(
    @Req() req: Request,
    @Body() createTweetInputDto: CreateTweetInputDto,
  ): Promise<CreateTweetOutputDto> {
    return await this.tweetsService.createTweet(req, createTweetInputDto);
  }

  @ApiOperation({ summary: `Get tweets - TWEETS_PAGE: ${TWEETS_PAGE}` })
  @ApiOkResponse({
    description: 'Get tweets',
  })
  @ApiQuery({
    name: 'page',
    example: 'http://localhost:3010/tweets?page=1',
    description: 'tweets page',
  })
  @Get()
  async getTweets(@Query() query): Promise<Tweets[]> {
    return await this.tweetsService.getTweets(query);
  }

  @ApiOperation({ summary: `Get tweets - TWEETS_PAGE: ${TWEETS_PAGE}` })
  @ApiOkResponse({
    description: 'Get tweets',
  })
  @ApiQuery({
    name: 'page',
    example: 'http://localhost:3010/3/tweets?page=1',
    description: 'Tweets page',
  })
  @ApiParam({
    name: 'userId',
    example: 'http://localhost:3010/3/tweets?page=1',
    description: 'User id for profile page',
  })
  @Get(':userId')
  async getProfileTweets(
    @Query() query,
    @Param() param: { userId: string },
  ): Promise<Tweets[]> {
    return await this.tweetsService.getProfileTweets(query, param);
  }

  @ApiOperation({ summary: 'Delete tweet' })
  @ApiOkResponse({
    description: 'Delete tweet',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized user',
  })
  @ApiParam({
    name: 'tweetsId',
    example: 'http://localhost:3010/tweets/35',
    description: 'delete tweet',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':tweetsId')
  async deleteTweets(@Req() req, @Param() param): Promise<UpdateResult> {
    return await this.tweetsService.deleteTweet(req, param);
  }
}
