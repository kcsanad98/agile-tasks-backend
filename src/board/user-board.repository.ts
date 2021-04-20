import { EntityRepository, Repository } from 'typeorm';
import { UserBoard } from './entities/user-board.entity';

@EntityRepository(UserBoard)
export class UserBoardRepository extends Repository<UserBoard> {}
