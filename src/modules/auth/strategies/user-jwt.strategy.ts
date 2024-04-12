import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { User } from "../../user/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserNotFoundException } from "../authException/User-Not-Found-Exception";

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt'){
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        readonly configService: ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET_KEY')
        });
    }

    async validate(payload: {id: number}): Promise<{id: number}>{
        const {id} = payload;
        const user = await this.userRepository.findOneBy({id});
        if(user){
            return {id};
        }
        throw new UserNotFoundException();
    }
}