import { Repository } from "typeorm";
import { CustomRepository } from "../../../config/mysql/custom-decorator-repository";
import { Board } from "../entity/board.entity";

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {

    async saveBoard(boardEntity: Board): Promise<Board> {
        return await this.save(boardEntity);
    }

    async findBoardById(boardId: number): Promise<Board|null> {
        return await this.findOne({
            where: {
                id: boardId
            },
            relations: ['creator', 'region']
        });
    }

    async findBoardDetail(boardId: number): Promise<Board|null> {
        const board = await this.createQueryBuilder('board')
        .select(['board.id',
          'board.stuffName',
          'board.stuffContent', 
          'board.stuffCategory', 
          'board.tradingPlace', 
          'board.status', 
          'board.likesCount', 
          'board.imageUrl', 
          'creator.nickname',
          'region.name' 
        ])
        .innerJoinAndSelect('board.creator', 'creator')
        .innerJoinAndSelect('board.region', 'region')
        .where('board.id = :boardId', {boardId})
        .getOne();

        return board;
    }

    async findAllBoard(regionId: number, take: number, skip: number): Promise<[Board[], number]|null> {
        const boards = await this.createQueryBuilder('board')
        .select(['board.id', 'board.stuffName', 'board.status', 'board.imageUrl', 'board.createAt'])
        .where('board.region_id = :regionId', { regionId })
        .andWhere('board.deleteAt IS NULL')
        .orderBy('board.id', 'DESC')
        .limit(take)
        .offset(skip)
        .getManyAndCount();

        return boards;
    }
}
