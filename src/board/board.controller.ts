import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';
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
        console.log(user);
        return this.boardService.getBoards(user);
    }

    @Post()
    public async createBoard(
        @Body() createBoardDto: CreateBoardDto,
        @GetUser() user: User
    ): Promise<GetBoardDto> {
        console.log(user);
        return this.boardService.createBoard(user, createBoardDto);
    }
}
