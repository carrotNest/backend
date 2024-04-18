import { GetBoardDto } from "./get-board.dto";

export class BoardResponseDto{
    data: GetBoardDto;
    meta: {isUserPushLikes: boolean};

    constructor(data: GetBoardDto, isUserPushLikes: boolean){
        this.data = data;
        this.meta = {isUserPushLikes: isUserPushLikes};
    }
}