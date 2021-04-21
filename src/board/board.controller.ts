import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.schema';
import { Schema as MongooseSchema } from 'mongoose';
import { CreateBoardDto } from './dto/create-board.dto';
import { GetBoardDto } from './dto/get-board.dto';
import { BoardService } from './board.service';
import { AuthGuard } from '@nestjs/passport';

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
        return this.boardService.getBoard(user, boardId);
    }

    @Post()
    public async createBoard(
        @Body() createBoardDto: CreateBoardDto,
        @GetUser() user: User
    ): Promise<GetBoardDto> {
        return this.boardService.createBoard(user, createBoardDto);
    }

    @Delete(':boardId')
    public async deleteBoard(
        @GetUser() user: User,
        @Param('boardId') boardId: MongooseSchema.Types.ObjectId
    ): Promise<void> {
        return this.boardService.deleteBoard(user, boardId);
    }
    /*
    @Put('users/add')
    public async addUserToBoard(@Body() userBoardDto: UserBoardDto): Promise<UserBoardDto> {
        return this.boardService.addUserToBoard(userBoardDto);
    }

    @Put('users/remove')
    public async removeUserFromBoard(@Body() userBoardDto: UserBoardDto): Promise<void> {
        return this.boardService.removeUserFromBoard(userBoardDto);
    }
    */
}
