import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../../user/entity/user.entity";
import { Region } from "src/modules/region/entity/region.entity";

@Injectable()
export class UserMapper {

    DtoToEntity({password, accountId, nickname}: CreateUserDto, region: Region): User{

        const user = new User();

        user.password = password;
        user.accountId = accountId;
        user.nickname = nickname;
        user.region = region;

        return user;
    }
}