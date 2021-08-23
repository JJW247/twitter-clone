import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { CreateUserInputDto, CreateUserOutputDto } from './dtos/createUser.dto';
import { FixIntroduceDto } from './dtos/fixIntroduce.dto';
import { GetMeOutputDto } from './dtos/getMe.dto';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({
    type: CreateUserOutputDto,
  })
  @Post()
  async createUser(
    @Body() createUserInputDto: CreateUserInputDto,
  ): Promise<CreateUserOutputDto> {
    return await this.usersService.createUser(createUserInputDto);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({
    type: LoginOutputDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Wrong password',
  })
  @Post('login')
  async login(@Body() loginInputDto: LoginInputDto): Promise<LoginOutputDto> {
    return await this.usersService.login(loginInputDto);
  }

  @ApiOperation({ summary: 'Get me - user id' })
  @ApiOkResponse({
    type: GetMeOutputDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request): Promise<GetMeOutputDto> {
    return await this.usersService.getMe(req);
  }

  @ApiOperation({ summary: 'Follow' })
  @ApiOkResponse()
  @UseGuards(JwtAuthGuard)
  @Post('follow/:userId')
  async follow(@Req() req: Request, @Param() param: { userId: string }) {
    return await this.usersService.follow(req, param);
  }

  @UseGuards(JwtAuthGuard)
  @Get('follower')
  async getFollower(@Req() req: Request) {
    return await this.usersService.getFollower(req);
  }

  @Get('profile/:userId')
  async getProfile(@Param() param: { userId: string }) {
    return await this.usersService.getProfile(param);
  }

  @UseGuards(JwtAuthGuard)
  @Put('introduce/:userId')
  async fixIntroduce(
    @Req() req: Request,
    @Body() fixIntroduceDto: FixIntroduceDto,
  ) {
    return await this.usersService.fixIntroduce(req, fixIntroduceDto);
  }
}
