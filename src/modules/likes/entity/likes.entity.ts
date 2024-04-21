import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entity/user.entity";
import { Board } from "../../board/entity/board.entity";

@Entity()
export class Likes{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'int', name: 'user_id'})
    userId: number;

    @Column({type: 'int', name: 'board_id'})
    boardId: number;

    @ManyToOne(type => User)
    @JoinColumn({name: 'user_id'})
    user: User;

    @ManyToOne(type => Board)
    @JoinColumn({name: 'board_id'})
    board: Board;
}