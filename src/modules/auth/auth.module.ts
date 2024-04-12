import { Module } from '@nestjs/common';
import { AuthController} from './auth.controller';
import { AuthService} from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { UserMapper } from './mapper/user.mapper';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserLocalStrategy } from './strategies/user-local.auth.strategy';
import { UserJwtStrategy } from './strategies/user-jwt.strategy';
import { Region } from '../region/entity/region.entity';
import { RefreshTokenService } from '../../config/redis/refresh-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Region]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION')
        },
      })
    }),
    ConfigModule,
    PassportModule
  ],
  controllers: [AuthController],
  providers: [AuthService, UserMapper, UserLocalStrategy, UserJwtStrategy, RefreshTokenService]
})
export class AuthModule {}
