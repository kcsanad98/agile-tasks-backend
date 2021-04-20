import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { GetBoardDto } from './dto/get-board.dto';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
    public async createBoard(user: User, createBoardDto: CreateBoardDto): Promise<GetBoardDto> {
        const board = new Board(createBoardDto.title);
        board.owner = user;
        await board.save();
        delete board.owner;
        return board;
    }
}
