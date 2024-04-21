import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserMapper } from './mapper/user.mapper';
import { AccountIdAlreadyExistsException } from './authException/AccountId-Already-Exists-Exception';
import { NicknameAlreadyExistsException } from './authException/Nickname-Already-Exists-Exception';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginInvalidPasswordException } from './authException/Login-Invalid-Password-Exception';
import * as bcrypt from 'bcrypt';
import { UserCreateResultInterface } from '../../interfaces/user-create-result.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserLoginResultInterface } from 'src/interfaces/user-login-result.interface';
import { UserNotFoundException } from './authException/User-Not-Found-Exception';
import { ParentRegionNotFoundException } from './authException/ParentRegion-Not-Found-Exception';
import { RegionNotFoundException } from './authException/Region-Not-Found-Exception';
import { RefreshTokenService } from '../../config/redis/refresh-token.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenInvalidException } from './authException/RefreshToken-Invalid-Exception';
import { RefreshTokenExpiredException } from './authException/RefreshToken-Expired-Exception';
import { UserRepository } from '../user/repository/user.repository';
import { RegionRepository } from '../region/repository/region.repository';

@Injectable()
export class AuthService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly regionRepository: RegionRepository,

        private readonly jwtService: JwtService,
        readonly configService: ConfigService,
        private readonly userMapper: UserMapper,
        private readonly refreshTokenService: RefreshTokenService
    ) {}


    async signup(createUserDto: CreateUserDto): Promise<UserCreateResultInterface> {
        const parentRegion = await this.regionRepository.findParentRegion(createUserDto.region.parentRegionName);
        if(!parentRegion){
            throw new ParentRegionNotFoundException();
        }

        const region = await this.regionRepository.findRegion(createUserDto.region.RegionName, parentRegion);
        if(!region){
            throw new RegionNotFoundException();
        }
        
        const isAccountIDExist = await this.userRepository.isAccountIDExist(createUserDto.accountId);
        if(isAccountIDExist) {
          throw new AccountIdAlreadyExistsException();
        }

        const isNicknameExist = await this.userRepository.isNicknameExist(createUserDto.nickname);
        if(isNicknameExist) {
            throw new NicknameAlreadyExistsException();
        }

        const {password} = createUserDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        createUserDto.password = hashedPassword;

        const newUserEntity = this.userMapper.DtoToEntity(createUserDto, region);
        const savedUser = await this.userRepository.saveUser(newUserEntity);

        return {
            message: '회원가입 성공',
            userId: savedUser.id,
        };
    }
    

    async validateUser(authCredentialsDto: AuthCredentialsDto): Promise<{id: number}> {
        const {accountId, password} = authCredentialsDto;
        const user = await this.userRepository.findUserByAccountId(accountId);

        if(user){
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if(isPasswordMatch){
                return {id: user.id};
            }else{
                throw new LoginInvalidPasswordException();
            }
        }else{
            throw new UserNotFoundException();
        }
    }

    async loginUser(id: number): Promise<UserLoginResultInterface> {
        const payload: {id: number} = {id};

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_EXPIRATION')
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION')
        });

        const expiresIn = this.configService.get('JWT_REFRESH_EXPIRATION_TTL');
        await this.refreshTokenService.setKey(`refreshToken:${id}`, refreshToken, expiresIn);

        const userRegion = await this.userRepository.findUserRegionById(id);
        const userRegionName = userRegion.region.name;
    
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            regionName: userRegionName,
        };
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{newAccessToken: string}> {
        const {refreshToken} = refreshTokenDto;

        const payload = this.jwtService.verify(refreshToken, {
            secret: this.configService.get('JWT_REFRESH_SECRET_KEY')
        });

        const userId = payload.id;
        const storedRefreshToken = await this.refreshTokenService.getKey(`refreshToken:${userId}`);

        if(storedRefreshToken === null){
            throw new RefreshTokenExpiredException();
        }

        if(storedRefreshToken === refreshToken){
            const newPayload = {id: userId};
            const newAccessToken = this.jwtService.sign(newPayload, {
                secret: this.configService.get('JWT_SECRET_KEY'),
                expiresIn: this.configService.get('JWT_EXPIRATION')
            });
            return {newAccessToken};     
        }else{
            throw new RefreshTokenInvalidException();
        }
    }
}