import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserMapper } from './mapper/user.mapper';
import { AccountIdAlreadyExistsException } from './authException/AccountIdAlreadyExistsException';
import { NicknameAlreadyExistsException } from './authException/NicknameAlreadyExistsException';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { NotFoundUserException } from './authException/NotFoundUserException';
import { LoginInvalidPasswordException } from './authException/LoginInvalidPasswordException';
import * as bcrypt from 'bcrypt';
import { UserCreateResultInterface } from '../../interfaces/user-create-result.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Region } from '../region/entity/region.entity';
import { UserLoginResultInterface } from 'src/interfaces/user-login-result.interface';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Region)
        private readonly regionRepository: Repository<Region>,

        private readonly jwtService: JwtService,
        readonly configService: ConfigService,
        private readonly userMapper: UserMapper
    ) {}

    // 회원가입
    async signup(createUserDto: CreateUserDto): Promise<UserCreateResultInterface>{

        // 동/면/리 같을 경우 상위 지역으로 중복 방지 
        const parentRegion = await this.regionRepository.findOne({where: {name: createUserDto.region.parentRegionName}});
        const region = await this.regionRepository.findOne({where: {
            name: createUserDto.region.RegionName,
            parent: parentRegion
        }});
        
        
        // 이메일 유효성체크
        const isAccountIDExist = await this.userRepository.findOne({where: {accountId:createUserDto.accountId}});
        if(isAccountIDExist) {
          throw new AccountIdAlreadyExistsException();
        }
        // 닉네임 유효성체크
        const isNicknameExist = await this.userRepository.findOne({where: {nickname: createUserDto.nickname}});
        if(isNicknameExist) {
            throw new NicknameAlreadyExistsException();
        }
        // 비밀번호 암호화
        const {password} = createUserDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        createUserDto.password = hashedPassword;

        const newUserEntity = this.userMapper.DtoToEntity(createUserDto,region);
        const savedUser = await this.userRepository.save(newUserEntity);

        return {
            message: '회원가입 성공',
            userId: savedUser.id,
        };
    }
    
    // 비밀번호 체크
    async validateUser(authCredentialsDto: AuthCredentialsDto): Promise<{id: number}>{
        const {accountId, password} = authCredentialsDto;
        const user = await this.userRepository.findOneBy({accountId});
        if(user){
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if(isPasswordMatch){
                return {id: user.id};
            }else{
                throw new LoginInvalidPasswordException();
            }
        }else{
            throw new NotFoundUserException();
        }

    }

    async loginUser(id: number): Promise<UserLoginResultInterface> {
        const payload: {id: number} = {id};
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET_KEY'),
        });
        const user = await this.userRepository.findOne({where: {id: id}, relations: ['region']});
        const userRegionName = user.region.name;
    
        return {
            accessToken: accessToken,
            regionName: userRegionName,
        };
    }
}