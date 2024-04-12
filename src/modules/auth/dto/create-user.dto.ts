import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmptyAndString } from "../../../decorators/is-Not-Empty-And-String.decorator";
import { AuthCredentialsDto } from "./auth-credentials.dto";
import { RegionDto } from "../../region/dto/region.dto";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateUserDto extends AuthCredentialsDto{

    @ApiProperty({example: 'testest'})
    @IsNotEmptyAndString(1,15)
    nickname!: string;

    @Type(() => RegionDto)
    @ValidateNested()
    region!: RegionDto;

}