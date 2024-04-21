import { Injectable } from '@nestjs/common';
import { BoardNotFoundException } from '../board/boardException/Board-Not-Found-Exception';
import { LikesMapper } from './mapper/likes.mapper';
import { UserNotFoundException } from '../auth/authException/User-Not-Found-Exception';
import { GetBoardDto } from '../board/dto/get-board.dto';
import { BoardResponseDto } from '../board/dto/board-response.dto';
import { LikesRepository } from './repository/likes.repository';
import { BoardRepository } from '../board/repository/board.repository';
import { UserRepository } from '../user/repository/user.repository';

@Injectable()
export class LikesService {
    constructor(
        private readonly likesRepository: LikesRepository,
        private readonly boardRepository: BoardRepository,
        private readonly userRepository: UserRepository,

        private readonly likesMapper: LikesMapper
    ){}

    async updateBoardLikes(boardId: number, userId: number): Promise<BoardResponseDto> {
        const board = await this.boardRepository.findBoardById(boardId);
        if(!board){
            throw new BoardNotFoundException();
        }

        const user = await this.userRepository.findUserById(userId);
        if(!user){
            throw new UserNotFoundException();
        }

        const isUserLikesExist = await this.likesRepository.isUserPushLikes(boardId, userId);

        const userNickname = board.creator.nickname;
        const regionName = board.region.name;

        let isUserPushLikes = true;

        if(isUserLikesExist){
            await this.likesRepository.remove(isUserLikesExist);
            board.likesCount = board.likesCount>0? board.likesCount-1 : 0;
            await this.boardRepository.save(board);
            isUserPushLikes = false;

        } else{
            const newLikesEntity = this.likesMapper.DtoToEntity(board, user);
            await this.likesRepository.saveLikes(newLikesEntity);

            board.likesCount++;
            await this.boardRepository.saveBoard(board);
        }

        const updateBoard = new GetBoardDto(board, userNickname, regionName);
        const response = new BoardResponseDto(updateBoard, isUserPushLikes);
        
        return response;
    }
}
