import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommonService } from 'src/common/common.service';
import { CreateUserInputDto, CreateUserOutputDto } from './dtos/createUser.dto';
import { Users } from './entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';
import { Request } from 'express';
import { GetMeOutputDto } from './dtos/getMe.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
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

    const checkPassword = await this.commonService.checkPassword(
      loginDto.password,
      user.password,
    );

    if (!checkPassword) {
      throw new HttpException('Wrong password.', HttpStatus.UNAUTHORIZED);
    }

    const token = this.jwtService.sign({ id: user.id });

    return { token };
  }

  async getMe(req: Request): Promise<GetMeOutputDto> {
    return { userId: req.user };
  }
}
