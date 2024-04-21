export class GetCommentDto {
    id: number;
    createAt: Date;
    content: string;
    creatorNickname: string;

    constructor(id: number, createAt: Date, content: string, creatorNickname: string) {
        this.id = id;
        this.createAt = createAt;
        this.content = content;
        this.creatorNickname = creatorNickname;
    }
}