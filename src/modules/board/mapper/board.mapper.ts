import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from '../dto/create-board.dto';
import { Board } from '../entity/board.entity';
import { User } from '../../user/entity/user.entity';
import { Region } from '../../region/entity/region.entity';

@Injectable()
export class BoardMapper {
  DtoToEntity(
    creator: User,
    image: string,
    region: Region,
    {
      stuffName,
      stuffContent,
      stuffPrice,
      tradingPlace,
      stuffCategory,
    }: CreateBoardDto,
  ): Board {
    const board = new Board();

    board.stuffName = stuffName;
    board.stuffContent = stuffContent;
    board.stuffPrice = stuffPrice;
    board.tradingPlace = tradingPlace;
    board.stuffCategory = stuffCategory;
    board.imageUrl = image;
    board.creator= creator;
    board.region = region;

    return board;
  }
}
