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
import { BoardStatusForbiddenException } from './boardException/Board-Status-Forbidden-Exception';
import { Likes } from '../likes/entity/likes.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,

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

  async getBoardDetail(boardId: number, userId: number){
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

      // 사용자가 좋아요를 눌렀는 지 안눌렀는 지 체크
      let isUserPushLikes = true;

      const userLike = await this.likesRepository.findOne({where: {
        boardId: boardId,
        userId: userId
      }});

      const userNickname = board.creator.nickname;
      const regionName = board.region.name;

      const getBoardDto = new GetBoardDto(board, userNickname, regionName);

      if(!userLike){
        isUserPushLikes = false;
      }
      return {getBoardDto, isUserPushLikes};
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

}
