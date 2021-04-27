import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Board, BoardDocument } from './board.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBoardDto } from './dto/create-board.dto';
import { GetBoardDto } from './dto/get-board.dto';
import { UserService } from 'src/user/user.service';
import { TaskService } from 'src/task/task.service';

const NO_ACCESS_ERROR = 'User has no access to requested board';

@Injectable()
export class BoardService {
    constructor(
        @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
        private userService: UserService,
        private taskService: TaskService
    ) {}

    public async getBoards(user: User): Promise<GetBoardDto[]> {
        const boardIds = user.boards;
        const boards = await this.boardModel.find({ _id: { $in: boardIds } });
        return boards.map(board => this.transformBoard(board));
    }

    public async getBoardById(
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
            .populate({
                path: 'tasks'
            })
            .exec();
        if (!board) {
            throw new NotFoundException(`No board available with id ${boardId}`);
        }
        return this.transformBoard(board);
    }

    public async createBoard(
        user: User,
        createBoardDto: CreateBoardDto
    ): Promise<MongooseSchema.Types.ObjectId> {
        const createdBoard = await new this.boardModel(createBoardDto).save();
        await this.createUserBoardConnection(user.id, createdBoard._id);
        return createdBoard._id;
    }

    public async deleteBoard(user: User, boardId: MongooseSchema.Types.ObjectId): Promise<void> {
        if (!this.hasAccess(user, boardId)) {
            throw new UnauthorizedException(NO_ACCESS_ERROR);
        }
        const boardToDelete = await this.getBoardById(user, boardId);

        boardToDelete.users
            .map(user => (user.id as unknown) as MongooseSchema.Types.ObjectId)
            .forEach(async userId => await this.deleteUserBoardConnection(userId, boardId));
        boardToDelete.tasks
            .map(task => (task.id as unknown) as MongooseSchema.Types.ObjectId)
            .forEach(async taskId => await this.taskService.deleteTask(taskId));
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

    public async addTaskToBoard(
        taskId: MongooseSchema.Types.ObjectId,
        boardId: MongooseSchema.Types.ObjectId
    ) {
        await this.boardModel
            .findByIdAndUpdate(
                boardId,
                { $addToSet: { tasks: taskId } },
                { new: true, useFindAndModify: false }
            )
            .exec();
    }

    public async removeTaskFromBoard(
        taskId: MongooseSchema.Types.ObjectId,
        boardId: MongooseSchema.Types.ObjectId
    ) {
        await this.boardModel
            .findByIdAndUpdate(
                boardId,
                { $pull: { tasks: taskId } },
                { useFindAndModify: false, multi: true }
            )
            .exec();
    }

    private async addUserToBoard(
        userId: MongooseSchema.Types.ObjectId,
        boardId: MongooseSchema.Types.ObjectId
    ): Promise<void> {
        await this.boardModel
            .findByIdAndUpdate(
                boardId,
                { $addToSet: { users: userId } },
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

    private transformBoard(board): GetBoardDto {
        const { _id, title } = board;
        const boardCopy: GetBoardDto = {
            id: _id,
            title,
            users: board.users.map(user => ({ id: user['_id'], email: user.email })),
            tasks: board.tasks.map(task => this.taskService.transformTask(task))
        };
        return boardCopy;
    }

    private hasAccess(user: User, boardId: MongooseSchema.Types.ObjectId): boolean {
        return user.boards.includes(boardId);
    }
}
