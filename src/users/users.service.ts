import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommonService } from 'src/common/common/common.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { Users } from './entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await this.commonService.hashPassword(
      createUserDto.password,
    );

    return await this.usersRepository.save({
      email: createUserDto.email,
      nickname: createUserDto.nickname,
      password: hashedPassword,
    });
  }

  async login(loginDto: LoginDto) {
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

    return { ok: true, token };
  }
}
