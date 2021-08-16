import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  @Get()
  @UseGuards(JwtAuthGuard)
  async isLogin(@Request() req) {
    return { ok: true };
  }
}
