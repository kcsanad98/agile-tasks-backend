import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as config from 'config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

const jwtConfig = config.get('jwt');

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository]),
        JwtModule.register({
            secret: process.env.JWT_SECRET || jwtConfig.secret,
            signOptions: {
                expiresIn: jwtConfig.expiresIn
            }
        }),
        PassportModule.register({
            defaultStrategy: 'jwt'
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
