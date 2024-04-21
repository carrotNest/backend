import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './entity/board.entity';
import { S3Service } from '../../config/s3/s3.service';
import { RedisService } from '../../config/redis/redis.service';
import { BoardMapper } from './mapper/board.mapper';
import { PageOptionsDto } from '../../global/common/paginate/dto/offset-paginate/page-options.dto';
import { PaginationResponseDto } from '../../global/common/paginate/dto/pagination-response.dto';
import { PageMetaDto } from '../../global/common/paginate/dto/offset-paginate/page-meta.dto';
import { PageNotExists } from '../../global/exception/pageException/Page-Not-Exists-Exception';
import { GetBoardDto } from './dto/get-board.dto';
import { BoardStatus } from '../../types/enums/boardStatus.enum';
import { BoardNotFoundException } from './boardException/Board-Not-Found-Exception';
import { BoardStatusForbiddenException } from './boardException/Board-Status-Forbidden-Exception';
import { BoardResponseDto } from './dto/board-response.dto';
import { BoardRepository } from './repository/board.repository';
import { UserRepository } from '../user/repository/user.repository';
import { LikesRepository } from '../likes/repository/likes.repository';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly userRepository: UserRepository,
    private readonly likesRepository: LikesRepository,

    private readonly boardMapper: BoardMapper,
    private readonly s3Service: S3Service,
    private readonly redisService: RedisService
  ) {}

  async createBoard(createBoardDto: CreateBoardDto, id: number, image: Express.Multer.File): Promise<BoardResponseDto> {
    const creator = await this.userRepository.findUserRegionById(id);
    const region = creator.region;
    const imageUrl = await this.s3Service.uploadImage(image);
    const newBoardEntity = this.boardMapper.DtoToEntity(creator, imageUrl, region, createBoardDto);

    const savedBoard = await this.boardRepository.saveBoard(newBoardEntity);

    const userNickname = creator.nickname;
    const regionName = region.name;

    const board = new GetBoardDto(savedBoard, userNickname, regionName);
    const response = new BoardResponseDto(board, false);

    return response;
  }

  async getBoardDetail(boardId: number, userId: number): Promise<BoardResponseDto> {
    const board = await this.boardRepository.findBoardDetail(boardId);

      if(!board){
        throw new BoardNotFoundException();
      }

      let isUserPushLikes = true;

      const isUserLikesExist = await this.likesRepository.isUserPushLikes(boardId, userId);

      const userNickname = board.creator.nickname;
      const regionName = board.region.name;

      const getBoardDto = new GetBoardDto(board, userNickname, regionName);

      if(!isUserLikesExist){
        isUserPushLikes = false;
      }

      const response = new BoardResponseDto(getBoardDto, isUserPushLikes);

      return response;
  }

  async getAllBoard(pageOptionsDto: PageOptionsDto, id: number):Promise<PaginationResponseDto<Board>> {
    const {take, skip} = pageOptionsDto;
    const user = await this.userRepository.findUserRegionById(id);
    const userRegionId = user.region.id;

    const [boards, totalCount] = await this.boardRepository.findAllBoard(userRegionId, take, skip);
      
    const pageMetaDto = new PageMetaDto({pageOptionsDto, totalCount});
    const lastPage = pageMetaDto.totalPage;

    if(pageOptionsDto.page<=lastPage){
      return new PaginationResponseDto(boards, pageMetaDto);
    }else{
      throw new PageNotExists();
    } 
  }

  async updateBoardStatus(boardId: number, userId: number, status: BoardStatus):Promise<BoardResponseDto> {

    const board = await this.boardRepository.findBoardById(boardId);
    if(!board){
      throw new BoardNotFoundException();
    }
    
    const boardCreatorId = board.userId;
    if(userId !== boardCreatorId){
      throw new BoardStatusForbiddenException();
    }

    board.status = status;
    await this.boardRepository.saveBoard(board);

    const userNickname = board.creator.nickname;
    const regionName = board.region.name;
    const updateBoard = new GetBoardDto(board, userNickname, regionName);

    let isUserPushLikes = true;

    const isUserLikesExist = await this.likesRepository.isUserPushLikes(boardId, userId);
    if(!isUserLikesExist){
      isUserPushLikes = false;
    }

    const response = new BoardResponseDto(updateBoard, isUserPushLikes);

    return response;
  }

}
