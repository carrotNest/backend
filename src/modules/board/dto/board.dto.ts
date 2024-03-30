import { BoardStatus } from "../../../types/enums/boardStatus.enum";
import { StuffCategory } from "../../../types/enums/stuffCategory.enum";
import { Board } from "../entity/board.entity";

export class BoardDto {
    id: number;
    stuffName: string;
    stuffContent: string;
    stuffCategory: StuffCategory;
    tradingPlace: string;
    status: keyof typeof BoardStatus;
    likesCount: number;
    imageUrl: string;

    constructor(board: Board){
        this.id = board.id;
        this.stuffName = board.stuffName;
        this.stuffContent = board.stuffContent;
        this.stuffCategory = board.stuffCategory;
        this.tradingPlace = board.tradingPlace;
        this.status = board.status;
        this.likesCount = board.likesCount;
        this.imageUrl = board.imageUrl;
    }
}