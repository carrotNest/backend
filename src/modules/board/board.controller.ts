import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserJwtAuthGuard } from '../auth/guards/user-jwt.guard';
import { UserId } from '../../decorators/user-id.decorator';
import { UserCreateResultInterface } from '../../interfaces/user-create-result.interface';
import { PageOptionsDto } from '../../global/common/paginate/dto/offset-paginate/page-options.dto';
import { PaginationResponseDto } from '../../global/common/paginate/dto/pagination-response.dto';
import { Board } from './entity/board.entity';
import { GetBoardDto } from './dto/get-board.dto';
import { BoardStatus } from '../../types/enums/boardStatus.enum';
import { BoardStatusValidationPipe } from '../../pipes/board-status-validation.pipe';
import { BoardResponseDto } from './dto/board-response.dto';

@ApiTags('board')
@ApiBearerAuth()
@UseGuards(UserJwtAuthGuard)
@Controller('boards')
export class BoardController {
  private readonly logger = new Logger('Board');
  constructor(
    private readonly boardService: BoardService,
  ) {}

  @HttpCode(201)
  @ApiOperation({ summary: '게시물 생성 API', description: '사용자가 게시물을 생성한다.' })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @UploadedFile() image: Express.Multer.File,
    @UserId() id: number,
  ): Promise<BoardResponseDto> {
    this.logger.verbose(`1.[사용자 ${id}가 게시물 생성] 2.[Dto: ${JSON.stringify(createBoardDto)}]`);
    return await this.boardService.createBoard(createBoardDto, id, image);
  }

  @HttpCode(200)
  @ApiOperation({ summary: '게시물 전체 조회 API', description: '사용자는 본인이 거주하는 동/면/리의 전체 게시글을 최신순으로 조회할 수 있다.'})
  @Get()
  async getAllBoard(
    @Query() pageOptionsDto: PageOptionsDto,
    @UserId() id: number,
  ): Promise<PaginationResponseDto<Board>> {
    this.logger.verbose(`사용자 ${id} 게시물 조회`);
    return await this.boardService.getAllBoard(pageOptionsDto, id);
  }

  @HttpCode(200)
  @ApiOperation({ summary: '게시물 상세 조회 API' })
  @Get('/:id')
  async getBoard(
    @Param('id', ParseIntPipe) boardId: number,
    @UserId() userId: number,
  ): Promise<BoardResponseDto>{
    return await this.boardService.getBoardDetail(boardId, userId);
  }

  @HttpCode(200)
  @ApiOperation({ summary: '게시물 상태 변경 API', description: '게시물을 생성한 사용자는 게시물의 판매중/판매완료 여부를 설정할 수 있다.'})
  @Patch('/:id/status')
  async updateBoardStatus(
    @Param('id', ParseIntPipe) boardId: number,
    @UserId() userId: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus
    ): Promise<BoardResponseDto>{
      return await this.boardService.updateBoardStatus(boardId, userId, status);
  }

}
