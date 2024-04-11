import { pageMetaParameter } from "../../../../../interfaces/page-meta-parameter.interface";

export class PageMetaDto {
    readonly page: number;
    readonly take: number;
    readonly totalPage: number;
    readonly totalCount: number;

    constructor({pageOptionsDto, totalCount}: pageMetaParameter){
        this.page = pageOptionsDto.page<=0? this.page = 1 : pageOptionsDto.page;
        this.take = pageOptionsDto.take;
        this.totalCount = totalCount;
        this.totalPage = Math.ceil(this.totalCount/this.take);
    }
}