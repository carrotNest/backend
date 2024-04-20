import { Injectable } from "@nestjs/common";
import { Likes } from "../entity/likes.entity";
import { Board } from "../../board/entity/board.entity";
import { User } from "../../user/entity/user.entity";

@Injectable()
export class LikesMapper{
    
    DtoToEntity(boardId: Board, userId: User): Likes{
        const likes = new Likes();

        likes.board = boardId;
        likes.user = userId;

        return likes;
    }
}