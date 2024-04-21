import { Injectable } from '@nestjs/common';
import { CommentMapper } from './mapper/comment.mapper';
import { Comment } from './entity/comment.entity';
import { CommentCursorOptionsDto } from './dto/commet-cursor-options.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserCreateResultInterface } from 'src/interfaces/user-create-result.interface';
import { PaginationResponseDto } from 'src/global/common/paginate/dto/pagination-response.dto';
import { CursorPageMetaDto } from 'src/global/common/paginate/dto/cursor-paginate/cursor-page-meta.dto';
import { CommentRepository } from './repository/comment.repository';
import { BoardRepository } from '../board/repository/board.repository';
import { UserRepository } from '../user/repository/user.repository';

@Injectable()
export class CommentService {

    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly boardRepository: BoardRepository,
        private readonly userRepository: UserRepository,

        private readonly commentMapper: CommentMapper
    ) {}

    async createComment(createCommentDto: CreateCommentDto, id: number): Promise<UserCreateResultInterface> {
        const creator = await this.userRepository.findOneBy({id});
        const board = await this.boardRepository.findOneBy({id: createCommentDto.boardId});
        const newCommentEntity = this.commentMapper.dtoToEntity(createCommentDto,creator,board);

        const savedComment = await this.commentRepository.saveComment(newCommentEntity);

        return{
            message: '새로운 댓글 생성',
            userId: savedComment.creator.id
        };
    }

    async getAllComment(commentCursorOptionsDto: CommentCursorOptionsDto): Promise<PaginationResponseDto<Comment>> {
        let {boardId, cursor, take} = commentCursorOptionsDto;

        const [comments, totalCount] = await this.commentRepository.findAllComment(boardId, take, cursor);

        const isLastPage = totalCount <= take; 
        let hasNextData = true;

        if(isLastPage){ 
            hasNextData = false; 
            cursor = null; 
        }else{
            cursor = comments[comments.length-1].id; 
        }
        
        const pageMetaDto = new CursorPageMetaDto({commentCursorOptionsDto, totalCount, hasNextData, cursor});

        return new PaginationResponseDto(comments, pageMetaDto);
    }
}