import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Board } from '../board/entity/board.entity';
import { CommentMapper } from './mapper/comment.mapper';
import { Comment } from './entity/comment.entity';
import { CustomTypeOrmModule } from 'src/config/mysql/custom-typeorm-module';
import { CommentRepository } from './repository/comment.repository';
import { BoardRepository } from '../board/repository/board.repository';
import { UserRepository } from '../user/repository/user.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([Comment, Board, User]),
    CustomTypeOrmModule.forCustomRepository([CommentRepository, BoardRepository, UserRepository]),
  ],  
  providers: [CommentService, CommentMapper],
  controllers: [CommentController]
})
export class CommentModule {}
