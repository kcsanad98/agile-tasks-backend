import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { JwTPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    /**
     * Handles user registration.
     *
     * @param {AuthCredentialsDto} authCredentialsDto - Credentials.
     * @returns {Promise<void>} - No return value.
     */
    public async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    /**
     * Handles user login.
     *
     * @param {AuthCredentialsDto} authCredentialsDto - Credentials.
     * @returns {Promise<{ accessToken: string }>} - Jwt token.
     */
    public async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const email = await this.userRepository.validateUserPassword(authCredentialsDto);
        if (!email) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload: JwTPayload = { email };
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken };
    }
}
