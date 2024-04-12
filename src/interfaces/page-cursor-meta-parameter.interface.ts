import { CommentCursorOptionsDto } from "../modules/comment/dto/commet-cursor-options.dto";

export interface PageCursorMetaParameter{
    commentCursorOptionsDto: CommentCursorOptionsDto;
    totalCount: number;
    hasNextData: boolean;
    cursor: number;
}