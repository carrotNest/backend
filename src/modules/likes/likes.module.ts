import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { LikesMapper } from './mapper/likes.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from './entity/likes.entity';
import { User } from '../user/entity/user.entity';
import { Board } from '../board/entity/board.entity';
import { CustomTypeOrmModule } from 'src/config/mysql/custom-typeorm-module';
import { LikesRepository } from './repository/likes.repository';
import { UserRepository } from '../user/repository/user.repository';
import { BoardRepository } from '../board/repository/board.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Likes, User, Board]),
    CustomTypeOrmModule.forCustomRepository([LikesRepository, UserRepository, BoardRepository]),
  ],
  controllers: [LikesController],
  providers: [LikesService, LikesMapper]
})
export class LikesModule {}
