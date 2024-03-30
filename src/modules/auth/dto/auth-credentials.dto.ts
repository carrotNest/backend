import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyAndString } from "../../../decorators/is-Not-Empty-And-String.decorator";
import { Matches } from "class-validator";

export class AuthCredentialsDto {
    
    /**
    * 로그인 할 아이디
    * @example test123
    */
    @ApiProperty({example: 'test111'})
    @IsNotEmptyAndString()
    accountId!: string;

    /**
    * 로그인 할 비밀번호
    * @example test@123123
    */
    @ApiProperty({example: '1234asdf'})
    @IsNotEmptyAndString(6, 15)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{6,}$/, {
        message: '비밀번호는 문자, 숫자, 특수문자를 조합해 6~15자 이내로 입력해주세요 ',
      })
    password!: string;
}