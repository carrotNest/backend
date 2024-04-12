import { IsNotEmptyAndString } from "../../../decorators/is-Not-Empty-And-String.decorator";
import { IsNotEmptyAndNumber } from "../../../decorators/is-Not-Empty-And-Number.decorator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {

    @ApiProperty({type: Number, description: '댓글을 달 게시물번호', required: true, example: '1'})
    @IsNotEmptyAndNumber()
    boardId!: number;

    @ApiProperty({type: String, description: '댓글 내용', required: true, example: '책 팝니다'})
    @IsNotEmptyAndString(1, 128)
    content!: string;
}