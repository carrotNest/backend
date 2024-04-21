import { Body, Controller, HttpCode, Post, Res, UseGuards} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService} from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserCreateResultInterface } from '../../interfaces/user-create-result.interface';
import { UserId } from '../../decorators/user-id.decorator';
import { UserLocalAuthGuard } from './guards/user-local.auth.guard';
import { Response } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';


@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ){}

    @HttpCode(201)
    @ApiOperation({summary: '사용자 회원가입'})
    @Post('/signup')
    async registerUser(
        @Body() createUserDto: CreateUserDto
    ): Promise<UserCreateResultInterface>{
        const response = await this.authService.signup(createUserDto);
        return {
            message: '회원가입 성공',
            userId: response
        };
    }

    @UseGuards(UserLocalAuthGuard)
    @HttpCode(201)
    @ApiOperation({summary: '사용자 로그인'})
    @Post('/signin')
    async loginUser(
        @Body() authCredentialsDto: AuthCredentialsDto,
        @UserId() userId: number,
        @Res() res: Response
    ): Promise<void>{
        const {accessToken, refreshToken, regionName} = await this.authService.loginUser(userId);

        res.cookie('accessToken', accessToken, {httpOnly: true});
        res.cookie('refreshToken', refreshToken, {httpOnly: true});

        res.status(201).json({
            message: '로그인 성공',
            regionName: regionName
        });
    }

    @Post('/refresh')
    async refreshToken(
        @Body() refreshTokenDto: RefreshTokenDto,
        @Res() res: Response
    ): Promise<void>{
        const {newAccessToken} = await this.authService.refreshToken(refreshTokenDto);

        res.cookie('newAccessToken', newAccessToken, {httpOnly: true});

        res.status(201).json({
            message: 'accessToken 갱신 성공'
        });
    }
}
