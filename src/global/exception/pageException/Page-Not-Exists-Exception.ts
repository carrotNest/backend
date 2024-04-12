import { HttpStatus } from "@nestjs/common";
import { CustomException } from "../customException";
import { ErrorCode } from "../errorCode/Errorcode";

export class PageNotExists extends CustomException{
    constructor(){
        super(
            ErrorCode.PAGE_NOT_EXIST,
            '해당 페이지는 존재하지 않습니다!',
            HttpStatus.NOT_FOUND,
        );
    }
}