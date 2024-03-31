import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { BoardStatusValidException } from "src/modules/board/boardException/Board-Status-Invalid-Exception";
import { BoardStatus } from "src/types/enums/boardStatus.enum";

export class BoardStatusValidationPipe implements PipeTransform{
    readonly boardStatusOptions = [BoardStatus.OPEN, BoardStatus.CLOSED];

    transform(value: any) {
        value = value.toUpperCase();

        if(!this.isStatusValid(value)){
            throw new BoardStatusValidException();
        }
        return value;
    }

    private isStatusValid(status: any){
        const idx = this.boardStatusOptions.indexOf(status);
        return idx !== -1;
    }
}