import { PageCursorMetaParameter } from "src/interfaces/page-cursor-meta-parameter.interface";

export class CursorPageMetaDto{
    readonly take: number;
    readonly totalCount: number;
    readonly hasNextData: boolean;
    readonly cursor: number;

    constructor({commentCursorOptionsDto, totalCount, hasNextData, cursor}: PageCursorMetaParameter){
        this.take = commentCursorOptionsDto.take;
        this.totalCount = totalCount;
        this.hasNextData = hasNextData;
        this.cursor = cursor;
    }
}