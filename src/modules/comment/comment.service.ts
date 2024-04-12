import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { CommentMapper } from './mapper/comment.mapper';
import { Comment } from './entity/comment.entity';
import { Board } from '../board/entity/board.entity';
import { CommentCursorOptionsDto } from './dto/commet-cursor-options.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserCreateResultInterface } from 'src/interfaces/user-create-result.interface';
import { PaginationResponseDto } from 'src/global/common/paginate/dto/pagination-response.dto';
import { CursorPageMetaDto } from 'src/global/common/paginate/dto/cursor-paginate/cursor-page-meta.dto';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly commentMapper: CommentMapper
    ) {}

    async createComment(createCommentDto: CreateCommentDto, id: number): Promise<UserCreateResultInterface> {
        const creator = await this.userRepository.findOneBy({id});
        const board = await this.boardRepository.findOneBy({id: createCommentDto.boardId});
        const newCommentEntity = this.commentMapper.dtoToEntity(createCommentDto,creator,board);

        const savedComment = await this.commentRepository.save(newCommentEntity);

        return{
            message: '새로운 댓글 생성',
            userId: savedComment.creator.id
        };
    }

    async getAllComment(commentCursorOptionsDto: CommentCursorOptionsDto): Promise<PaginationResponseDto<Comment>> {
        let {boardId, cursor, take} = commentCursorOptionsDto;
        const querybuilder = this.commentRepository
            .createQueryBuilder('comment')
            .innerJoin('comment.creator', 'user')
            .select(['comment.id', 'comment.content', 'comment.createAt', 'user.nickname'])
            .where('comment.board.id =:id', {id: boardId})
            .orderBy('comment.createAt', 'DESC')
            .limit(take);

            if(cursor){
                querybuilder.andWhere('comment.id < :cursor' ,{cursor: cursor});
            }

        const [comments, totalCount] = await querybuilder.getManyAndCount();

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