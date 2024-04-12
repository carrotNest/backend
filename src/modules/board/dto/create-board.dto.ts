import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { StuffCategory } from '../../../types/enums/stuffCategory.enum';
import { IsNotEmptyAndString } from '../../../decorators/is-Not-Empty-And-String.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyAndNumber } from '../../../decorators/is-Not-Empty-And-Number.decorator';

export class CreateBoardDto {

  @ApiProperty({type: String, description: '게시물 이름', required: true, example: '책 팔아요!'})
  @IsNotEmptyAndString(1, 128)
  stuffName!: string;

  @ApiProperty({type: String, description: '게시물 내용', required: true, example: '싸게 내놓습니다!'})
  @IsNotEmptyAndString(1, 128)
  stuffContent!: string;

  @ApiProperty({type: Number, description: '게시물 가격', required: true, example: '12000'})
  @IsNotEmptyAndNumber()
  stuffPrice!: number;

  @ApiProperty({type: String, description: '거래 장소', required: true, example: '경기도 수원시 영통구 센트럴파크로 6'})
  @IsNotEmptyAndString()
  tradingPlace!: string;

  @ApiProperty({
    enum: StuffCategory,
    description: '게시물 카테고리',
    required: true,
    example: StuffCategory.BEAUTY
  })
  @IsEnum(StuffCategory)
  @IsNotEmpty()
  stuffCategory!: StuffCategory;


  @ApiProperty({type: String, format: 'binary', description: '첨부할 사진', example: '4f457e7df2f7242fc74ec4667b4bccb5d0bbab1214a29e381afae56101ded106'})
  @IsOptional()
  image?: Express.Multer.File;
}