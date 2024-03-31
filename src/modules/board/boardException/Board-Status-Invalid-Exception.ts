import { ErrorCode } from "../../../global/exception/errorCode/Errorcode";
import { CustomException } from "../../../global/exception/customException";
import { HttpStatus } from "@nestjs/common";

export class BoardStatusValidException extends CustomException {
    constructor(){
        super(
            ErrorCode.BOARD_STATUS_NOT_FOUND,
            '게시물의 상태는 OPEN과 CLOSED 2가지 입니다. 다시 입력해주세요!',
            HttpStatus.CONFLICT,
        )
    }
}