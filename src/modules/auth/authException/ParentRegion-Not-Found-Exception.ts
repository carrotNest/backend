import { ErrorCode } from "../../../global/exception/errorCode/Errorcode";
import { CustomException } from "../../../global/exception/customException";
import { HttpStatus } from "@nestjs/common";

export class ParentRegionNotFoundException extends CustomException {

    constructor(){
        super(
            ErrorCode.PARENT_REGION_NOT_FOUND,
            '없는 상위 지역명입니다!',
            HttpStatus.NOT_FOUND,
        )
    }
}