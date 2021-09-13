import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { VerifyCodeInputDto } from './dtos/verifyCode.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async sendVerifyEmail(user: Users) {
    await this.mailerService.sendMail({
      to: user.email,
      from: this.configService.get<string>('MAILGUN_USER'),
      subject: '트위터 클론 인증 메일',
      html: `Verity Code : ${user.verifyCode}`,
    });
  }

  async verifyCode(verifyCodeInputDto: VerifyCodeInputDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: verifyCodeInputDto.email,
      },
    });

    if (user.verifyCode !== verifyCodeInputDto.verifyCode)
      throw new HttpException(
        '인증 번호가 틀렸습니다.',
        HttpStatus.UNAUTHORIZED,
      );

    user.verify = true;

    await this.usersRepository.save(user);

    const token = this.jwtService.sign({ id: user.id });

    return { token };
  }
}
