import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { Repository } from 'typeorm';
import { Board } from './entity/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { S3Service } from '../../config/s3/s3.service';
import { RedisService } from '../../config/redis/redis.service';
import { BoardMapper } from './mapper/board.mapper';
import { UserCreateResultInterface } from '../../interfaces/user-create-result.interface';
import { PageOptionsDto } from '../../global/common/paginate/dto/offset-paginate/page-options.dto';
import { PaginationResponseDto } from '../../global/common/paginate/dto/pagination-response.dto';
import { PageMetaDto } from '../../global/common/paginate/dto/offset-paginate/page-meta.dto';
import { PageNotExists } from '../../global/exception/pageException/Page-Not-Exists-Exception';
import { GetBoardDto } from './dto/get-board.dto';
import { BoardStatus } from '../../types/enums/boardStatus.enum';
import { BoardNotFoundException } from './boardException/Board-Not-Found-Exception';
import { UserNotFoundException } from '../auth/authException/User-Not-Found-Exception';
import { BoardStatusForbiddenException } from './boardException/Board-Status-Forbidden-Exception';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly boardMapper: BoardMapper,
    private readonly s3Service: S3Service,
    private readonly redisService: RedisService
  ) {}

  async createBoard(
    createBoardDto: CreateBoardDto,
    id: number,
    image: Express.Multer.File,
  ): Promise<UserCreateResultInterface> {

    const creator = await this.userRepository.findOne({where: {id: id}, relations: ['region']});
    const region = creator.region;
    const imageUrl = await this.s3Service.uploadImage(image);
    const newBoardEntity = this.boardMapper.DtoToEntity(creator, imageUrl, region, createBoardDto);

    const savedBoard = await this.boardRepository.save(newBoardEntity);

    return {
      message: '새로운 게시물 생성',
      userId: savedBoard.creator.id
    };
  }

  async getBoardDetail(boardId: number): Promise<GetBoardDto> {
    const board = await this.boardRepository
      .createQueryBuilder('board')
      .select(['board.id',
        'board.stuffName',
        'board.stuffContent', 
        'board.stuffCategory', 
        'board.tradingPlace', 
        'board.status', 
        'board.likesCount', 
        'board.imageUrl', 
        'creator.nickname',
        'region.name' 
      ])
      .innerJoinAndSelect('board.creator', 'creator')
      .innerJoinAndSelect('board.region', 'region')
      .where('board.id = :boardId', {boardId})
      .getOne();

      if(!board){
        throw new BoardNotFoundException();
      }

      const userNickname = board.creator.nickname;
      const regionName = board.region.name;

      const getBoardDto = new GetBoardDto(board, userNickname, regionName);

      return getBoardDto;
  }

  async getAllBoard(pageOptionsDto: PageOptionsDto, id: number):Promise<PaginationResponseDto<Board>>{

    const user = await this.userRepository.findOne({where: {id: id}, relations: ['region']});
    const userRegionId = user.region.id;

    const [boards, totalCount] = await this.boardRepository
      .createQueryBuilder('board')
      .select(['board.id', 'board.stuffName', 'board.status', 'board.imageUrl', 'board.createAt'])
      .where('board.region_id = :userRegionId', { userRegionId })
      .andWhere('board.deleteAt IS NULL')
      .orderBy('board.id', 'DESC')
      .limit(pageOptionsDto.take)
      .offset(pageOptionsDto.skip)
      .getManyAndCount();
      
    const pageMetaDto = new PageMetaDto({pageOptionsDto, totalCount});
    const lastPage = pageMetaDto.totalPage;

    if(pageOptionsDto.page<=lastPage){
      return new PaginationResponseDto(boards, pageMetaDto);
    }else{
      throw new PageNotExists();
    } 
  }

  async updateBoardStatus(boardId: number, userId: number, status: BoardStatus):Promise<GetBoardDto>{

    const board = await this.boardRepository.findOne({where: {id: boardId}, relations: ['creator', 'region']});
    const boardCreatorId = board.userId;

    if(userId !== boardCreatorId){
      throw new BoardStatusForbiddenException();
    }

    board.status = status;
    await this.boardRepository.save(board);

    const userNickname = board.creator.nickname;
    const regionName = board.region.name;
    const updateBoard = new GetBoardDto(board, userNickname, regionName);

    return updateBoard;
  }


  async updateBoardLikes(boardId: number, userId: number): Promise<{board: Board; isUserChecked: Boolean}>{
    const isBoardExist = await this.boardRepository.findOne({where: {id: boardId}});
    if(!isBoardExist){
      throw new BoardNotFoundException();
    }
    const isUserExist = await this.userRepository.findOne({where:{id: userId}});
    if(!isUserExist){
      throw new UserNotFoundException();
    }

    //게시물 좋아요 key, 유저가 해당 게시물에 좋아요 여부 key생성 -> redis가 게시물의 좋아요와 유저의 중복체크를 확인해줌
    const redisBoardKey = 'Board:' + boardId.toString(); 
    const redisUserKey = 'User:' + userId.toString();

    // 해당 게시물key에 사용자가 좋아요 눌렀는 지 판별
    const isUserLiked = await this.redisService.isUserIncludeSet(redisUserKey, boardId.toString());

    // 좋아요를 누르지 않았다면 -> 좋아요+1 후 게시물key에 add
    let boardLikes: number;
    let isUserChecked: boolean;
    if(!isUserLiked){
      boardLikes = await this.redisService.boardLikesInc(redisBoardKey);
      await this.redisService.addUserLikesSet(redisUserKey, boardId.toString());
      isUserChecked = true;
    // 좋아요를 눌렀다면 -> 좋아요-1 후 게시물 key에 remove
    }else{
      boardLikes = await this.redisService.boardLikesDec(redisBoardKey);
      await this.redisService.removeUserLikesSet(redisUserKey, boardId.toString());
      isUserChecked = false;
    }
    // 데이터베이스에 반영
    isBoardExist.likesCount = boardLikes;
    await this.boardRepository.save(isBoardExist);
    return {board:isBoardExist, isUserChecked};
  }
}
