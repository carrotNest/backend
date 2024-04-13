import { HttpStatus } from "@nestjs/common";
import { CustomException } from "../../../global/exception/customException";
import { ErrorCode } from "../../../global/exception/errorCode/Errorcode";

export class RefreshTokenExpiredException extends CustomException {
    constructor(){
        super(
            ErrorCode.REFRESH_TOKEN_EXPIRED,
            'Refresh Token이 만료되었습니다! 다시 로그인해주세요.',
            HttpStatus.UNAUTHORIZED,
        );
    }
}