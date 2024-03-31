import { ErrorCode } from "../../../global/exception/errorCode/Errorcode";
import { CustomException } from "../../../global/exception/customException";
import { HttpStatus } from "@nestjs/common";

export class BoardStatusForbiddenException extends CustomException{
    constructor(){
        super(
            ErrorCode.BOARD_STATUS_FORBIDDEN,
            '게시물의 상태는 게시물 생성자만 변경할 수 있습니다.',
            HttpStatus.FORBIDDEN,
        )
    }
}