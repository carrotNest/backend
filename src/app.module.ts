import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { MysqlModule } from './config/mysql/mysql.module';
import { BoardModule } from './modules/board/board.module';
import { CommentModule } from './modules/comment/comment.module';
import { RedisModule } from './config/redis/redis.module';
import { LikesModule } from './modules/likes/likes.module';


@Module({
  imports: [
    AuthModule,
    BoardModule,
    CommentModule,
    MysqlModule,
    RedisModule,
    LikesModule
  ],
})
export class AppModule {}
