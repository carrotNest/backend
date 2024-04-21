import { Board } from "../entity/board.entity";
import { BoardDto } from "./board.dto";

export class GetBoardDto extends BoardDto{
    userNickname: string;
    regionName: string;

    constructor(board: Board, userNickname: string, regionName: string){
        super(board);
        this.userNickname = userNickname;
        this.regionName = regionName;
    }
}