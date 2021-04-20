import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {}

    /**
     * Reads all users from the database.
     *
     * @returns {Promise<User[]>} - All registered users.
     */
    public async getAllUsers(): Promise<User[]> {
        const users = await this.userRepository.find();
        return users.map(user => this.removeSensitiveAttributes(user));
    }

    /**
     * Reads a user by Id from the database.
     *
     * @param {number} id - Id of the user.
     * @returns {Promise<User>} - User if it was found.
     * @throws {NotFoundException} - If no user was found.
     */
    public async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ id });
        if (user) {
            return this.removeSensitiveAttributes(user);
        }
        throw new NotFoundException(`No user exists with Id ${id}`);
    }

    /**
     * Removes a user from the database.
     *
     * @param {User} user - User to be removed.
     */
    public async deleteUser(user: User): Promise<void> {
        this.userRepository.delete(user);
    }

    private removeSensitiveAttributes(user: User): User {
        const { password, salt, ...userCopy } = user;
        return userCopy as User;
    }
}
