import { PageOptionsDto } from "../global/common/paginate/dto/offset-paginate/page-options.dto"

export interface pageMetaParameter{
    pageOptionsDto: PageOptionsDto;
    totalCount: number;
}