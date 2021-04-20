import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/user/user.entity';
import { JwTPayload } from 'src/auth/jwt-payload.interface';
import { UserRepository } from 'src/user/user.repository';
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret')
        });
    }

    /**
     * Authenticates a user who tries to log in via email.
     *
     * @param {JwTPayload} payload - Credentials.
     * @returns {Promise<User>} - User object if the authentication was successful.
     * @throws {UnauthorizedException} - If the authentication was not successful.
     */
    public async validate(payload: JwTPayload): Promise<User> {
        const { email } = payload;
        const user = await this.userRepository.findOne({ email });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
