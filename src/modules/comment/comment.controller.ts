import { Body, Controller, Get, Logger, Post, Query, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserId } from '../../decorators/user-id.decorator';
import { UserCreateResultInterface } from '../../interfaces/user-create-result.interface';
import { UserJwtAuthGuard } from '../auth/guards/user-jwt.guard';
import { CommentCursorOptionsDto } from './dto/commet-cursor-options.dto';
import { PaginationResponseDto } from 'src/global/common/dto/pagination-response.dto';
import { Comment } from './entity/comment.entity';

@ApiTags('comment')
@UseGuards(UserJwtAuthGuard)
@Controller('comments')
export class CommentController {
    private readonly logger = new Logger('comment');
    constructor(
        private readonly commentService: CommentService
    ) {}

    @ApiOperation({summary: '사용자는 댓글을 등록할 수 있다.'})
    @Post()
    async createComment(
        @Body() createCommentDto: CreateCommentDto,
        @UserId() id: number,
    ): Promise<UserCreateResultInterface>{
        this.logger.verbose(`1.[사용자 ${id}가 댓글 생성] 2. [Dto: ${JSON.stringify(createCommentDto)}]`);
        return await this.commentService.createComment(createCommentDto,id);
        
    }

    @ApiOperation({summary: '해당 게시글의 댓글들을 조회한다.'})
    @Get()
    async getAllComment(
        @Query() commentCursorOptionsDto: CommentCursorOptionsDto
    ): Promise<PaginationResponseDto<Comment>>{
        return await this.commentService.getAllComment(commentCursorOptionsDto);
    }
}
