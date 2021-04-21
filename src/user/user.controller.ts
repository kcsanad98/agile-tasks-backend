import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUserDto } from './dto/get-user.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.schema';
import { Schema as MongooseSchema } from 'mongoose';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    public async getAllUsers(): Promise<GetUserDto[]> {
        return this.userService.getAllUsers();
    }

    @Get('/:id')
    public async getUserById(@Param('id') id: MongooseSchema.Types.ObjectId): Promise<GetUserDto> {
        return this.userService.getUserById(id);
    }

    @Delete()
    public async deleteUser(@GetUser() user: User): Promise<void> {
        return this.userService.deleteUser(user);
    }
}
