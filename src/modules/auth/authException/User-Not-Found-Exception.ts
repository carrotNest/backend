import { HttpStatus } from "@nestjs/common";
import { CustomException } from "../../../global/exception/customException";
import { ErrorCode } from "../../../global/exception/errorCode/Errorcode";

export class UserNotFoundException extends CustomException {
    constructor() {
        super(
            ErrorCode.USER_NOT_FOUND,
            '사용자를 찾을 수 없습니다!',
            HttpStatus.CONFLICT,
        );
    }
}