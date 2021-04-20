import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    /**
     * Sign up endpoint.
     *
     * @param {AuthCredentialsDto} authCredentialsDto - Credentials.
     * @returns {Promise<void>} - No return value.
     */
    @Post('/signup')
    public async signUp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
    ): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    /**
     * Sign in endpoint.
     *
     * @param {AuthCredentialsDto} authCredentialsDto - Credentials.
     * @returns {Promise<{ accessToken: string }>} - Jwt token.
     */
    @Post('/signin')
    public async signIn(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
    ): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }
}
