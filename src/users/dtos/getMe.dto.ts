import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetMeOutputDto {
  @ApiProperty({
    example: '1',
    description: 'userId - number',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: Express.User;
}
