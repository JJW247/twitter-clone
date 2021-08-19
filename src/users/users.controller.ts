import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { CreateUserInputDto, CreateUserOutputDto } from './dtos/createUser.dto';
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
}
