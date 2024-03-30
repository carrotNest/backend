import { User } from '../../user/entity/user.entity';
import { BaseEntity } from '../../../global/common/entity/base.entitiy';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import { Comment } from '../../comment/entity/comment.entity';
import { StuffCategory } from '../../../types/enums/stuffCategory.enum';
import { BoardStatus } from '../../../types/enums/boardStatus.enum';
import { Region } from '../../region/entity/region.entity';

@Index('board_idx', ['regionId', 'deleteAt', 'id', 'createAt', 'stuffName', 'status', 'imageUrl'])
@Entity()
export class Board extends BaseEntity {

  // 애초에 manytoone인 컬럼값을 명시적으로 선언하는 게 어떨까? -> 게시물 create 할 때 region_id일단 Null이니까 이 부분 체크

  @Column()
  stuffName!: string;

  @Column()
  stuffContent!: string;

  @Column()
  stuffPrice!: number;

  @Column()
  tradingPlace!: string;

  @Column({ name: 'stuffCategory', type: 'varchar', length: 128 })
  stuffCategory: StuffCategory;

  @Column({ name: 'status', type: 'varchar', length: 128, default: BoardStatus.OPEN })
  status: keyof typeof BoardStatus;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  creator: User;

  @ManyToOne((type) => Region)
  @JoinColumn({name: 'region_id' })
  region: Region;

  @OneToMany((type) => Comment, (comment) => comment.board)
  comments: Comment[];

  @Column({ type: 'int', name: 'region_id', nullable: true })
  regionId: number;

  @Column({ type: 'int', name: 'user_id', nullable: true })
  userId: number;
}
