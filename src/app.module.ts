import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from './users/entities/users.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TweetsModule } from './tweets/tweets.module';
import { Tweets } from './tweets/entities/tweets.entity';
import { LikesModule } from './likes/likes.module';
import { Likes } from './likes/entities/likes.entity';
import { Comments } from './comments/entities/comments.entity';
import { CommentsModule } from './comments/comments.module';
import { Follows } from './users/entities/follows.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.NODE_ENV === 'production'
        ? {
            url: process.env.DATABASE_URL,
            extra: { ssl: { rejectUnauthorized: false } },
          }
        : {
            host: process.env.DATABASE_HOST,
            port: +process.env.DATABASE_PORT,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE,
          }),
      entities: [Users, Tweets, Likes, Comments, Follows],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    AuthModule,
    TweetsModule,
    LikesModule,
    CommentsModule,
  ],
})
export class AppModule {}
