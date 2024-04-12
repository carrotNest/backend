import { Body, Controller, HttpCode, Post, Res, UseGuards} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService} from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserCreateResultInterface } from '../../interfaces/user-create-result.interface';
import { UserId } from '../../decorators/user-id.decorator';
import { UserLocalAuthGuard } from './guards/user-local.auth.guard';
import { Response } from 'express';


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
    ): Promise<UserCreateResultInterface> {
        return await this.authService.signup(createUserDto);
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
}
