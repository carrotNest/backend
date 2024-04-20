import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../../global/common/entity/base.entitiy";
import { User } from "../../user/entity/user.entity";
import { Board } from "../../board/entity/board.entity";

@Entity()
export class Likes{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User)
    @JoinColumn({name: 'user_id'})
    user: User;

    @ManyToOne(type => Board)
    @JoinColumn({name: 'board_id'})
    board: Board;
}