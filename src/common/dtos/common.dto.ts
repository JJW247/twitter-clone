import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI5MzMwODIwfQ.o-jyaachxo73rBdzFunweQEmaJaahP4hvAXo_KQtAhc',
    description: 'token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
