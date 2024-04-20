import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Likes } from './entity/likes.entity';
import { Board } from '../board/entity/board.entity';
import { BoardNotFoundException } from '../board/boardException/Board-Not-Found-Exception';
import { LikesMapper } from './mapper/likes.mapper';
import { User } from '../user/entity/user.entity';
import { UserNotFoundException } from '../auth/authException/User-Not-Found-Exception';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Likes)
        private readonly likesRepository: Repository<Likes>,
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        
        private readonly likesMapper: LikesMapper
    ){}

    async updateBoardLikes(boardId: number, userId: number){

        const board = await this.boardRepository.findOne({where: {id: boardId}});
        
        if(!board){
            throw new BoardNotFoundException();
        }

        const user = await this.userRepository.findOne({where: {id: userId}});

        if(!user){
            throw new UserNotFoundException();
        }

        const isUserLikesExist = await this.likesRepository.findOne({where: {
            board: {id: boardId},
            user: {id: userId}
        }});

        if(isUserLikesExist){
            await this.likesRepository.remove(isUserLikesExist);
            board.likesCount = board.likesCount>0? board.likesCount-1 : 0;
            await this.boardRepository.save(board);
            
            return {
                message: '좋아요 취소'
            }

        } else{
            const newLikesEntity = this.likesMapper.DtoToEntity(board, user);
            await this.likesRepository.save(newLikesEntity);

            board.likesCount++;
            await this.boardRepository.save(board);
            return {
                message: '좋아요 성공'
            }
        
        }
    }
}
