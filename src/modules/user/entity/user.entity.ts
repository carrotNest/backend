import { BaseEntity } from "../../../global/common/entity/base.entitiy";
import { Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import { Region } from "../../region/entity/region.entity";

@Entity()
export class User extends BaseEntity{

    @Column()
    password: string;

    @Column()
    nickname: string;

    @Column()
    accountId: string;

    @ManyToOne(type => Region)
    @JoinColumn({name: 'region_id'})
    region: Region;
}