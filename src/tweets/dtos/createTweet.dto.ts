import { IsString } from 'class-validator';

export class CreateTweetDto {
  @IsString()
  tweet: string;
}
