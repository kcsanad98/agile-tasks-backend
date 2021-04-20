import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { GetBoardDto } from './dto/get-board.dto';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(BoardRepository) private boardRepository: BoardRepository,
        @InjectRepository(UserRepository) private userRepository: UserRepository
    ) {}

    public async getBoards(user: User): Promise<GetBoardDto[]> {
        const userWithBoards = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['boards']
        });
        return userWithBoards.ownedBoards;
    }

    public async createBoard(user: User, createBoardDto: CreateBoardDto): Promise<GetBoardDto> {
        return this.boardRepository.createBoard(user, createBoardDto);
    }
}
