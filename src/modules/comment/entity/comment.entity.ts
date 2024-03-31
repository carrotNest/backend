import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../../global/common/entity/base.entitiy";
import { Board } from "../../board/entity/board.entity";
import { User } from "../../user/entity/user.entity";

@Entity()
export class Comment extends BaseEntity {

    @Column({type: 'int', name: 'board_id'})
    boardId: number;

    @Column({type: 'int', name: 'user_id'})
    userId: number;
    
    @Column()
    content: string;

    @ManyToOne(type => Board)
    @JoinColumn({name: 'board_id'})
    board: Board;

    @ManyToOne(type => User)
    @JoinColumn({name: 'user_id'})
    creator: User;
}