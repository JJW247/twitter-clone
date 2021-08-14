import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommonService } from 'src/common/common/common.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { Users } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly commonService: CommonService,
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
}
