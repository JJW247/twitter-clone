import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommonService } from 'src/common/common.service';
import { CreateUserInputDto, CreateUserOutputDto } from './dtos/createUser.dto';
import { Users } from './entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';
import { Request } from 'express';
import { Follows } from './entities/follows.entity';
import { GetFollowOutputDto } from './dtos/getFollow.dto';
import { GetProfileOutputDto } from './dtos/getProfile.dto';
import {
  ModifyIntroduceInputDto,
  ModifyIntroduceOutputDto,
} from './dtos/modifyIntroduce.dto';
import { Profiles } from './entities/profiles.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Follows)
    private readonly followsRepository: Repository<Follows>,
    @InjectRepository(Profiles)
    private readonly profilesRepository: Repository<Profiles>,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async createUser(
    createUserDto: CreateUserInputDto,
  ): Promise<{ email: string; nickname: string }> {
    const hashedPassword = await this.commonService.hashPassword(
      createUserDto.password,
    );

    const verifyCode: number =
      Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;

    const user = await this.usersRepository.save({
      email: createUserDto.email,
      nickname: createUserDto.nickname,
      password: hashedPassword,
      verifyCode: verifyCode.toString(),
    });

    await this.authService.sendVerifyEmail(user);

    return {
      email: user.email,
      nickname: user.nickname,
    };
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

  async getMe(req: Request): Promise<number> {
    return +req.user;
  }

  async follow(req: Request, param: { userId: string }): Promise<Follows> {
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
        HttpStatus.UNAUTHORIZED,
      );

    const existFollow = await this.followsRepository.findOne({
      where: {
        follower: user.id,
        following: req.user,
      },
    });

    if (existFollow) {
      await this.followsRepository.delete({ id: existFollow.id });
      return existFollow;
    }
    const follow = await this.followsRepository.create({
      follower: user,
      following: req.user,
    });

    return await this.followsRepository.save(follow);
  }

  async getFollow(req: Request): Promise<GetFollowOutputDto[]> {
    const follows = await this.followsRepository
      .createQueryBuilder('follows')
      .leftJoin('follows.follower', 'follower')
      .leftJoin('follows.following', 'following')
      .where('follower.id = :followerId', { followerId: +req.user })
      .select(['follows.id', 'follower.id', 'following.id'])
      .getMany();

    console.log('-----------------------------------------------------');
    console.log(req.user);
    console.log(follows);

    return follows;
  }

  async getFollowers(param: { userId: string }) {
    return await this.followsRepository
      .createQueryBuilder('follows')
      .leftJoin('follows.following', 'following')
      .leftJoin('follows.follower', 'follower')
      .where('follower.id = :followerId', { followerId: param.userId })
      .select([
        'follows.id',
        'following.id',
        'following.nickname',
        'following.introduce',
      ])
      .orderBy('follows.createdAt', 'ASC')
      .getMany();
  }

  async getFollowings(param: { userId: string }) {
    return await this.followsRepository
      .createQueryBuilder('follows')
      .leftJoin('follows.following', 'following')
      .leftJoin('follows.follower', 'follower')
      .where('following.id = :followingId', { followingId: param.userId })
      .select([
        'follows.id',
        'follower.id',
        'follower.nickname',
        'follower.introduce',
      ])
      .orderBy('follows.createdAt', 'ASC')
      .getMany();
  }

  async getProfile(param: { userId: string }): Promise<GetProfileOutputDto> {
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
      throw new HttpException(
        '???????????? ?????? ???????????????!',
        HttpStatus.BAD_REQUEST,
      );

    return user;
  }

  async modifyIntroduce(
    req: Request,
    modifyIntroduceInputDto: ModifyIntroduceInputDto,
  ): Promise<ModifyIntroduceOutputDto> {
    const user = await this.usersRepository.findOne({
      where: {
        id: req.user,
      },
    });

    user.introduce = modifyIntroduceInputDto.introduce;

    return await this.usersRepository.save(user);
  }

  async profileImage(req: Request, files: Array<Express.MulterS3.File>) {
    const existProfiles = await this.profilesRepository.findOne({
      where: {
        user: req.user,
      },
    });

    if (existProfiles) {
      await this.profilesRepository.delete({ id: existProfiles.id });
    }

    const profiles = await this.profilesRepository.create({
      filename: files[0].key,
      originalFilename: files[0].originalname,
      user: req.user,
    });

    return await this.profilesRepository.save(profiles);
  }

  async getProfileImage(param: { userId: string }) {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .leftJoin('users.profiles', 'profiles')
      .where('users.id = :userId', { userId: param.userId })
      .select(['users.id', 'profiles.id', 'profiles.filename'])
      .getOne();

    return user;
  }
}
