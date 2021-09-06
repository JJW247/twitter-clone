import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

import { CommonModule } from 'src/common/common.module';
import { Follows } from './entities/follows.entity';
import { Users } from './entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Profiles } from './entities/profiles.entity';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Follows, Profiles]),
    CommonModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        fileFilter: (req, file, callback) => {
          if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) callback(null, true);
          else
            callback(
              new HttpException('Not Image', HttpStatus.BAD_REQUEST),
              false,
            );
        },
        limits: {
          fileSize: 1024 * 1024 * 5,
        },
        storage: multerS3({
          s3,
          bucket:
            configService.get<string>('AWS_S3_BUCKET_NAME') +
            '/profiles-jjw247',
          acl: 'public-read',
          key: (req, file, callback) => {
            callback(null, `${uuid()}${extname(file.originalname)}`);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
