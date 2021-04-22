import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.schema';
import { Schema as MongooseSchema } from 'mongoose';
import { CreateBoardDto } from './dto/create-board.dto';
import { GetBoardDto } from './dto/get-board.dto';
import { BoardService } from './board.service';
import { AuthGuard } from '@nestjs/passport';
import { UserBoardDto } from './dto/user-board.dto';

@Controller('board')
@UseGuards(AuthGuard())
export class BoardController {
    constructor(private boardService: BoardService) {}

    @Get()
    public async getBoards(@GetUser() user: User): Promise<GetBoardDto[]> {
        return this.boardService.getBoards(user);
    }

    @Get(':boardId')
    public async getBoardById(
        @GetUser() user: User,
        @Param('boardId') boardId: MongooseSchema.Types.ObjectId
    ): Promise<GetBoardDto> {
        return this.boardService.getBoardById(user, boardId);
    }

    @Post()
    public async createBoard(
        @Body(ValidationPipe) createBoardDto: CreateBoardDto,
        @GetUser() user: User
    ): Promise<MongooseSchema.Types.ObjectId> {
        return this.boardService.createBoard(user, createBoardDto);
    }

    @Delete(':boardId')
    public async deleteBoard(
        @GetUser() user: User,
        @Param('boardId') boardId: MongooseSchema.Types.ObjectId
    ): Promise<void> {
        return this.boardService.deleteBoard(user, boardId);
    }

    @Put('users/add')
    public async addUserToBoard(@Body() userBoardDto: UserBoardDto): Promise<void> {
        const { userId, boardId } = userBoardDto;
        return this.boardService.createUserBoardConnection(userId, boardId);
    }

    @Put('users/remove')
    public async removeUserFromBoard(@Body() userBoardDto: UserBoardDto): Promise<void> {
        const { userId, boardId } = userBoardDto;
        return this.boardService.deleteUserBoardConnection(userId, boardId);
    }
}
