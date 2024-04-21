import { Repository } from "typeorm";
import { CustomRepository } from "../../../config/mysql/custom-decorator-repository";
import { Comment } from "../entity/comment.entity";

@CustomRepository(Comment)
export class CommentRepository extends Repository<Comment> {

    async saveComment(commentEntity: Comment): Promise<Comment> {
        return await this.save(commentEntity);
    }

    async findAllComment(boardId: number, take: number, cursor?: number): Promise<[Comment[], number]> {
        const comment = this.createQueryBuilder('comment')
            .innerJoin('comment.creator', 'user')
            .select(['comment.id', 'comment.content', 'comment.createAt', 'user.nickname'])
            .where('comment.board.id =:id', {id: boardId})
            .orderBy('comment.createAt', 'DESC')
            .limit(take);

            if(cursor){
                comment.andWhere('comment.id < :cursor' ,{cursor: cursor});
            }

        const [comments, totalCount] = await comment.getManyAndCount();

        return [comments, totalCount];

    }
}