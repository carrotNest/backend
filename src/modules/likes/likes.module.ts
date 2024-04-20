import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { LikesMapper } from './mapper/likes.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from './entity/likes.entity';
import { User } from '../user/entity/user.entity';
import { Board } from '../board/entity/board.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Likes, User, Board])
  ],
  controllers: [LikesController],
  providers: [LikesService, LikesMapper]
})
export class LikesModule {}
