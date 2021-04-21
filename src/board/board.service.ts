import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Board, BoardDocument } from './board.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBoardDto } from './dto/create-board.dto';
import { GetBoardDto } from './dto/get-board.dto';
import { UserService } from 'src/user/user.service';

const NO_ACCESS_ERROR = 'User has no access to requested board';

@Injectable()
export class BoardService {
    constructor(
        @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
        private userService: UserService
    ) {}

    public async getBoards(user: User): Promise<GetBoardDto[]> {
        const boardIds = user.boards;
        const boards = await this.boardModel.find({ _id: { $in: boardIds } });
        return boards.map(board => this.transformBoard(board));
    }

    public async getBoard(
        user: User,
        boardId: MongooseSchema.Types.ObjectId
    ): Promise<GetBoardDto> {
        if (!this.hasAccess(user, boardId)) {
            throw new UnauthorizedException(NO_ACCESS_ERROR);
        }
        const board: BoardDocument = await this.boardModel
            .findById(boardId)
            .populate({
                path: 'users'
            })
            .exec();
        if (!board) {
            throw new NotFoundException(`No board available with id ${boardId}`);
        }
        return this.transformBoard(board);
    }

    public async createBoard(user: User, createBoardDto: CreateBoardDto): Promise<GetBoardDto> {
        const createdBoard = await new this.boardModel(createBoardDto).save();
        await this.createUserBoardConnection(user.id, createdBoard._id);
        return this.transformBoard(createdBoard);
    }

    public async deleteBoard(user: User, boardId: MongooseSchema.Types.ObjectId): Promise<void> {
        if (!this.hasAccess(user, boardId)) {
            throw new UnauthorizedException(NO_ACCESS_ERROR);
        }
        const boardToDelete = await this.getBoard(user, boardId);
        boardToDelete.users
            .map(user => (user.id as unknown) as MongooseSchema.Types.ObjectId)
            .forEach(async userId => await this.deleteUserBoardConnection(userId, boardId));
        this.boardModel.findByIdAndDelete(boardId).exec();
    }

    public async createUserBoardConnection(
        userId: MongooseSchema.Types.ObjectId,
        boardId: MongooseSchema.Types.ObjectId
    ) {
        await this.addUserToBoard(userId, boardId);
        await this.userService.addBoardToUser(userId, boardId);
    }

    public async deleteUserBoardConnection(
        userId: MongooseSchema.Types.ObjectId,
        boardId: MongooseSchema.Types.ObjectId
    ) {
        await this.removeUserFromBoard(userId, boardId);
        await this.userService.removeBoardFromUser(userId, boardId);
    }

    private async addUserToBoard(
        userId: MongooseSchema.Types.ObjectId,
        boardId: MongooseSchema.Types.ObjectId
    ): Promise<void> {
        await this.boardModel
            .findByIdAndUpdate(
                boardId,
                { $push: { users: userId } },
                { new: true, useFindAndModify: false }
            )
            .exec();
    }

    private async removeUserFromBoard(
        userId: MongooseSchema.Types.ObjectId,
        boardId: MongooseSchema.Types.ObjectId
    ): Promise<void> {
        await this.boardModel
            .findByIdAndUpdate(
                boardId,
                { $pull: { users: userId } },
                { useFindAndModify: false, multi: true }
            )
            .exec();
    }

    private transformBoard(board: BoardDocument): GetBoardDto {
        const { _id, title } = board;
        const boardCopy: GetBoardDto = {
            id: _id,
            title,
            users: board.users.map(user => ({ id: user['_id'], email: user.email }))
        };
        return boardCopy;
    }

    private hasAccess(user: User, boardId: MongooseSchema.Types.ObjectId): boolean {
        return user.boards.includes(boardId);
    }
}
