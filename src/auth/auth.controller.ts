import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyCodeInputDto } from './dtos/verifyCode.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  async verifyCode(@Body() verifyCodeInputDto: VerifyCodeInputDto) {
    return this.authService.verifyCode(verifyCodeInputDto);
  }
}
