import { ApiProperty } from "@nestjs/swagger";
import { IsOptionalAndNumber } from "../../../../../decorators/is-Optional-And-Number.decorators";

export class PageOptionsDto{

    @ApiProperty({ type: Number, description: '조회 할 페이지', required: false, nullable: true })
    @IsOptionalAndNumber()
    page?: number|null = 1;

    @ApiProperty({ type: Number, description: '한 페이지에 나오는 데이터의 개수', required: false, nullable: true })
    @IsOptionalAndNumber()
    readonly take?: number|null = 6;

    get skip(): number{
        return this.page<=0? this.page = 0 : (this.page-1)*this.take;
    }
}