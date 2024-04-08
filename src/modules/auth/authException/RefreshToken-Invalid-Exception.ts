import { HttpStatus } from "@nestjs/common";
import { CustomException } from "../../../global/exception/customException";
import { ErrorCode } from "../../../global/exception/errorCode/Errorcode";

export class RefreshTokenInvalidException extends CustomException {
    constructor(){
        super(
            ErrorCode.REFRESH_TOKEN_INVALID,
            '유효하지 않는 Refresh Token 입니다!',
            HttpStatus.UNAUTHORIZED,
        );
    }
}