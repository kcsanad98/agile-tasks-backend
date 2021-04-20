import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
    constructor(private userService: UserService) {}

    /**
     * Read all users endpoint.
     *
     * @returns {Promise<User[]>} - All registered users.
     */
    @Get()
    public async getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    /**
     * Read a user by Id endpoint.
     *
     * @param {number} id - Id of the user.
     * @returns {Promise<User>} - User if it was found.
     */
    @Get('/:id')
    public async getUserById(@Param('id') id: string): Promise<User> {
        return this.userService.getUserById(id);
    }

    /**
     * Delete user endpoint.
     *
     * @param {User} user - User to be removed.
     * @returns {Promise<void>} - No return value.
     */
    @Delete()
    public async deleteUser(@GetUser() user: User): Promise<void> {
        return this.userService.deleteUser(user);
    }
}
