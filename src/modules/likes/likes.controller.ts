import { Controller, HttpCode, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { UserJwtAuthGuard } from '../auth/guards/user-jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('likes')
@UseGuards(UserJwtAuthGuard)
@Controller('likes')
export class LikesController {
    constructor(
        private readonly likesService: LikesService
    ) {}

    @HttpCode(201)
    @ApiOperation({ summary: '게시물 좋아요 API', description: '게시물에 좋아요를 누른다.' })
    @Post('/:boardId')
    async updateBoardLikes(
        @Param('boardId', ParseIntPipe) boardId: number,
        @UserId() userId: number
    ){
        return await this.likesService.updateBoardLikes(boardId, userId);
    }
}
