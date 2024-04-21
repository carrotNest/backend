import { Repository } from "typeorm";
import { CustomRepository } from "../../../config/mysql/custom-decorator-repository";
import { Likes } from "../entity/likes.entity";

@CustomRepository(Likes)
export class LikesRepository extends Repository<Likes> {

    async saveLikes(likesEntity: Likes): Promise<Likes> {
        return await this.save(likesEntity);
    }

    async isUserPushLikes(boardId: number, userId: number): Promise<Likes>{
        const isLikesExist = await this.findOne({
            where: {
                boardId: boardId,
                userId: userId
            }
        });

        return isLikesExist;
    }
}