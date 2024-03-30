import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserJwtAuthGuard } from '../auth/guards/user-jwt.guard';
import { UserId } from '../../decorators/user-id.decorator';
import { UserCreateResultInterface } from '../../interfaces/user-create-result.interface';
import { PageOptionsDto } from '../../global/common/dto/page-options.dto';
import { PaginationResponseDto } from '../../global/common/dto/pagination-response.dto';
import { Board } from './entity/board.entity';
import { GetBoardDto } from './dto/get-board.dto';
@ApiTags('board')
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
  ): Promise<UserCreateResultInterface> {
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
  async getBoard(@Param('id', ParseIntPipe) id: number ): Promise<GetBoardDto> {
    return await this.boardService.getBoardDetail(id);
  }

   @Post('/:boardId/likes')
  async updateBoardLike(@Body() body: { boardId: number, userId: number }, @Res() res: Response): Promise<void> {
    const { boardId, userId } = body;
    const response = await this.boardService.updateBoardLikes(boardId, userId);
    res.status(HttpStatus.CREATED).json(response);
  }
}
