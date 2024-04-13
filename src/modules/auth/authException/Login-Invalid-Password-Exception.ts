import { HttpStatus } from "@nestjs/common";
import { CustomException } from "../../../global/exception/customException";
import { ErrorCode } from "../../../global/exception/errorCode/Errorcode";

export class LoginInvalidPasswordException extends CustomException {
    constructor(){
        super(
            ErrorCode.USER_INVALID_PASSWROD,
            '비밀번호가 일치하지 않습니다! 다시 로그인을 해주세요.',
            HttpStatus.UNAUTHORIZED,
        );
    }
}