import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { CreateUserInputDto, CreateUserOutputDto } from './dtos/createUser.dto';
import { FollowOutputDto } from './dtos/follow.dto';
import { GetFollowOutputDto } from './dtos/getFollow.dto';
import { GetProfileOutputDto } from './dtos/getProfile.dto';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';
import {
  ModifyIntroduceInputDto,
  ModifyIntroduceOutputDto,
} from './dtos/modifyIntroduce.dto';
import { Follows } from './entities/follows.entity';
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
    type: Number,
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request): Promise<number> {
    return await this.usersService.getMe(req);
  }

  @ApiOperation({ summary: 'Follow user' })
  @ApiOkResponse({
    type: FollowOutputDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Not exist user.',
  })
  @ApiResponse({
    status: 401,
    description: "You can't follow yourself.",
  })
  @UseGuards(JwtAuthGuard)
  @Post('follow/:userId')
  async follow(
    @Req() req: Request,
    @Param() param: { userId: string },
  ): Promise<Follows> {
    return await this.usersService.follow(req, param);
  }

  @ApiOperation({ summary: 'Get user all follow' })
  @ApiOkResponse({
    type: [GetFollowOutputDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('follow')
  async getFollow(@Req() req: Request) {
    return await this.usersService.getFollow(req);
  }

  @Get('followers/:userId')
  async getFollowers(@Param() param: { userId: string }) {
    return await this.usersService.getFollowers(param);
  }

  @Get('followings/:userId')
  async getFollowings(@Param() param: { userId: string }) {
    return await this.usersService.getFollowings(param);
  }

  @ApiOperation({ summary: 'Get user profile infomation.' })
  @ApiOkResponse({
    type: [GetProfileOutputDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Not exist user',
  })
  @Get('profile/:userId')
  async getProfile(
    @Param() param: { userId: string },
  ): Promise<GetProfileOutputDto> {
    return await this.usersService.getProfile(param);
  }

  @ApiOperation({ summary: 'Modify my introduce.' })
  @ApiOkResponse({
    type: [ModifyIntroduceOutputDto],
  })
  @UseGuards(JwtAuthGuard)
  @Put('introduce/:userId')
  async modifyIntroduce(
    @Req() req: Request,
    @Body() modifyIntroduceInputDto: ModifyIntroduceInputDto,
  ): Promise<ModifyIntroduceOutputDto> {
    return await this.usersService.modifyIntroduce(
      req,
      modifyIntroduceInputDto,
    );
  }

  @Put('profile/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async profileImage(
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.usersService.profileImage(req, files);
  }

  @Get('profile/image/:userId')
  async getProfileImage(@Param() param: { userId: string }) {
    return await this.usersService.getProfileImage(param);
  }
}
