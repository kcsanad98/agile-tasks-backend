import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { JwTPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const EMAIL_EXISTS_ERROR = 11000;
const EMAIL_EXISTS_MESSAGE = 'Email already exists';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    /**
     * Handles user registration.
     *
     * @param {AuthCredentialsDto} authCredentialsDto - Credentials.
     * @returns {Promise<void>} - No return value.
     */
    public async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const salt = await bcrypt.genSalt();
        const password = await this.hashPassword(authCredentialsDto.password, salt);
        const user: User = new User(authCredentialsDto.email, password, salt);
        return this.createUser(user);
    }

    private async createUser(user: User): Promise<void> {
        try {
            const createdUser = new this.userModel(user);
            await createdUser.save();
        } catch (error) {
            if (error.code === EMAIL_EXISTS_ERROR) {
                throw new ConflictException(EMAIL_EXISTS_MESSAGE);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    /**
     * Handles user login.
     *
     * @param {AuthCredentialsDto} authCredentialsDto - Credentials.
     * @returns {Promise<{ accessToken: string }>} - Jwt token.
     */
    public async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const email = await this.validateUserPassword(authCredentialsDto);
        if (!email) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload: JwTPayload = { email };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    private async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { email, password } = authCredentialsDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const hash = await bcrypt.hash(password, user.salt);
        return user && hash === user.password ? user.email : null;
    }
}
