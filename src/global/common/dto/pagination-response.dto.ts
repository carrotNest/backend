import { IsArray } from "class-validator";
import { PageMetaDto } from "./page-meta.dto";
import { CursorPageMetaDto } from "./cursor-page-meta.dto";
export class PaginationResponseDto<T> {
    @IsArray()
    data: T[];

    meta: PageMetaDto|CursorPageMetaDto;

    constructor(data: T[], meta: PageMetaDto|CursorPageMetaDto){
        this.data = data;
        this.meta = meta;
    }

}