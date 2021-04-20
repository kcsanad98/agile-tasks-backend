import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { GetBoardDto } from './dto/get-board.dto';
import { UserBoardDto } from './dto/user-board.dto';
import { UserBoard } from './entities/user-board.entity';
import { UserBoardRepository } from './user-board.repository';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(BoardRepository) private boardRepository: BoardRepository,
        @InjectRepository(UserBoardRepository) private userBoardRepository: UserBoardRepository
    ) {}

    public async getBoards(user: User): Promise<GetBoardDto[]> {
        const userBoards: UserBoard[] = await this.userBoardRepository.find({ userId: user.id });
        const boardIds = userBoards.map(userBoard => userBoard.boardId);
        return this.boardRepository.findByIds(boardIds);
    }

    public async getBoard(user: User, boardId: string): Promise<GetBoardDto> {
        //TODO: check permission
        return this.boardRepository.findOne({ id: boardId });
    }

    public async createBoard(user: User, createBoardDto: CreateBoardDto): Promise<GetBoardDto> {
        const board = await this.boardRepository.create(createBoardDto).save();
        await this.userBoardRepository.create({ userId: user.id, boardId: board.id }).save();
        return board;
    }

    public async deleteBoard(user: User, boardId: string): Promise<void> {
        //TODO: check permission
        this.userBoardRepository.delete({ boardId: boardId });
        this.boardRepository.delete({ id: boardId });
    }

    public async addUserToBoard(userBoardDto: UserBoardDto) {
        return this.userBoardRepository.create(userBoardDto).save();
    }

    public async removeUserFromBoard(userBoardDto: UserBoardDto): Promise<void> {
        console.log(userBoardDto);
        this.userBoardRepository.delete({
            userId: userBoardDto.userId,
            boardId: userBoardDto.boardId
        });
    }
}
