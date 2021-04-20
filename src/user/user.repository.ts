import { AuthCredentialsDto } from 'src/auth/auth-credentials.dto';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const EMAIL_EXISTS_ERROR = 11000;
const EMAIL_EXISTS_MESSAGE = 'Email already exists';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    /**
     * Handles user registration via email.
     *
     * @param {AuthCredentialsDto} authCredentialsDto - Credentials.
     * @returns {Promise<void>} - No return value.
     */
    public async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const user = await this.createUser(authCredentialsDto);
        return this.saveUser(user);
    }

    /**
     * Checks whether the user trying to log in exists and uses correct credentials.
     *
     * @param {AuthCredentialsDto} authCredentialsDto - Credentials.
     * @returns {Promise<string>} - Email address of the user if the validation was successful.
     */
    public async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { email, password } = authCredentialsDto;
        const user = await this.findOne({ email });
        return user && (await user.validatePassword(password)) ? user.email : null;
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    private async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const email = authCredentialsDto.email;
        const salt = await bcrypt.genSalt();
        const password = await this.hashPassword(authCredentialsDto.password, salt);
        return new User(email, password, salt);
    }

    private async saveUser(user: User): Promise<void> {
        try {
            await user.save();
        } catch (error) {
            if (error.code === EMAIL_EXISTS_ERROR) {
                throw new ConflictException(EMAIL_EXISTS_MESSAGE);
            } else {
                Logger.error(error.message, this.constructor.name);
                throw new InternalServerErrorException();
            }
        }
    }
}
