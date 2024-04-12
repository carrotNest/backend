import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmptyAndNumber } from "src/decorators/is-Not-Empty-And-Number.decorator";
import { IsOptionalAndNumber } from "src/decorators/is-Optional-And-Number.decorators";

export class CommentCursorOptionsDto{
    
    @ApiProperty({ type: Number, description: '조회 할 댓글의 게시물 id', required: true })
    @IsNotEmptyAndNumber()
    boardId: number;

    @ApiProperty({type: Number, description: '조회할 커서 값', nullable: true })
    @Type(() => Number)
    @IsOptionalAndNumber()
    cursor: number|null;

    @ApiProperty({ type: Number, description: '한 페이지에 나오는 데이터의 개수', required: false, nullable: true })
    @IsOptionalAndNumber()
    @Type(() => Number)
    readonly take?: number|null = 5;
}