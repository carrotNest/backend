import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entity/board.entity';
import { BoardMapper } from './mapper/board.mapper';
import { User } from '../user/entity/user.entity';
import { Comment } from '../comment/entity/comment.entity';
import { S3Module } from '../../config/s3/s3.module';
import { MulterModule } from '@nestjs/platform-express';
import { RedisModule } from '@songkeys/nestjs-redis';
import { RedisService } from '../../config/redis/redis.service';
import { Likes } from '../likes/entity/likes.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Board, User, Comment, Likes]),
    S3Module,
    RedisModule,
    MulterModule.register(),
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardMapper, RedisService]
})
export class BoardModule {}
