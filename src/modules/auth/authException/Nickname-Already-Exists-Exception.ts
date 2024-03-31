import { HttpStatus } from "@nestjs/common";
import { CustomException } from "../../../global/exception/customException";
import { ErrorCode } from "../../../global/exception/errorCode/Errorcode";

export class NicknameAlreadyExistsException extends CustomException {
    constructor() {
        super(
            ErrorCode.USER_NICKNAME_ALREADY_EXIST,
            '이미 존재하는 닉네임이 있습니다!',
            HttpStatus.CONFLICT,
        );
    }
}