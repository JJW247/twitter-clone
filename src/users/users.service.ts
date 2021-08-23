import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommonService } from 'src/common/common.service';
import { CreateUserInputDto, CreateUserOutputDto } from './dtos/createUser.dto';
import { Users } from './entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';
import { Request } from 'express';
import { GetMeOutputDto } from './dtos/getMe.dto';
import { Follows } from './entities/follows.entity';
import { FixIntroduceDto } from './dtos/fixIntroduce.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Follows)
    private readonly followsRepository: Repository<Follows>,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(
    createUserDto: CreateUserInputDto,
  ): Promise<CreateUserOutputDto> {
    const hashedPassword = await this.commonService.hashPassword(
      createUserDto.password,
    );

    const user = await this.usersRepository.save({
      email: createUserDto.email,
      nickname: createUserDto.nickname,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user.id });

    return { token };
  }

  async login(loginDto: LoginInputDto): Promise<LoginOutputDto> {
    const user = await this.usersRepository.findOne({
      where: {
        email: loginDto.email,
      },
      select: ['id', 'password'],
    });

    if (!user)
      throw new HttpException('Not exist user.', HttpStatus.BAD_REQUEST);

    const checkPassword = await this.commonService.checkPassword(
      loginDto.password,
      user.password,
    );

    if (!checkPassword)
      throw new HttpException('Wrong password.', HttpStatus.UNAUTHORIZED);

    const token = this.jwtService.sign({ id: user.id });

    return { token };
  }

  async getMe(req: Request): Promise<GetMeOutputDto> {
    return { userId: req.user };
  }

  async follow(req: Request, param: { userId: string }) {
    const user = await this.usersRepository.findOne({
      where: {
        id: param.userId,
      },
    });

    if (!user)
      throw new HttpException('Not exist user.', HttpStatus.BAD_REQUEST);
    if (req.user === user.id)
      throw new HttpException(
        "You can't follow yourself.",
        HttpStatus.BAD_REQUEST,
      );

    const existFollow = await this.followsRepository.findOne({
      where: {
        follower: req.user,
        following: user.id,
      },
    });

    if (existFollow) {
      await this.followsRepository.delete({ id: existFollow.id });
      return { existFollow, deleted: true };
    }
    const follow = await this.followsRepository.create({
      follower: req.user,
      following: user,
    });

    return await this.followsRepository.save(follow);
  }

  async getFollower(req: Request) {
    const follow = await this.followsRepository
      .createQueryBuilder('follows')
      .leftJoin('follows.follower', 'follower')
      .leftJoin('follows.following', 'following')
      .where('follower.id = :followerId', { followerId: req.user })
      .select(['follows.id', 'follower.id', 'following.id'])
      .getMany();

    return follow;
  }

  async getProfile(param: { userId: string }) {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .leftJoin('users.followers', 'followers')
      .leftJoin('users.followings', 'followings')
      .leftJoin('users.tweets', 'tweets')
      .where('users.id = :userId', { userId: param.userId })
      .select([
        'users.id',
        'users.nickname',
        'users.introduce',
        'followers.id',
        'followings.id',
        'tweets.id',
      ])
      .getOne();

    if (!user)
      throw new HttpException('Not exist user', HttpStatus.BAD_REQUEST);

    return user;
  }

  async fixIntroduce(req: Request, fixIntroduceDto: FixIntroduceDto) {
    const user = await this.usersRepository.findOne({
      where: {
        id: req.user,
      },
    });

    user.introduce = fixIntroduceDto.introduce;

    return await this.usersRepository.save(user);
  }
}
