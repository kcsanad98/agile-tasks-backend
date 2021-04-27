import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { GetUserDto } from './get-user.dto';
import { BoardService } from 'src/board/board.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @Inject(forwardRef(() => BoardService)) private boardService: BoardService
    ) {}

    public async getAllUsers(filter?: string): Promise<GetUserDto[]> {
        const findOpts = {};
        if (filter) {
            findOpts['email'] = { $regex: filter };
        }
        const users = await this.userModel.find(findOpts).populate('boards').exec();
        return users.map(user => this.removeSensitiveAttributes(user));
    }

    public async getUserById(id: MongooseSchema.Types.ObjectId): Promise<GetUserDto> {
        const user = await this.userModel.findById(id).populate('boards').exec();
        if (user) {
            return this.removeSensitiveAttributes(user);
        }
        throw new NotFoundException(`No user exists with Id ${id}`);
    }

    public async deleteUser(user: User): Promise<void> {
        const userToDelete = await this.getUserById(user.id);
        userToDelete.boards
            .map(board => (board.id as unknown) as MongooseSchema.Types.ObjectId)
            .forEach(
                async boardId => await this.boardService.deleteUserBoardConnection(user.id, boardId)
            );
        this.userModel.findByIdAndDelete(user.id).exec();
    }

    public async addBoardToUser(
        userId: MongooseSchema.Types.ObjectId,
        boardId: MongooseSchema.Types.ObjectId
    ) {
        await this.userModel
            .findByIdAndUpdate(
                userId,
                { $addToSet: { boards: boardId } },
                { new: true, useFindAndModify: false }
            )
            .exec();
    }

    public async removeBoardFromUser(
        userId: MongooseSchema.Types.ObjectId,
        boardId: MongooseSchema.Types.ObjectId
    ): Promise<void> {
        await this.userModel
            .findByIdAndUpdate(
                userId,
                { $pull: { boards: boardId } },
                { useFindAndModify: false, multi: true }
            )
            .exec();
    }

    public removeSensitiveAttributes(user): GetUserDto {
        const { _id, email, boards } = user;
        const userCopy: GetUserDto = {
            id: _id,
            email,
            boards: boards.map(board => ({ id: board._id, title: board.title }))
        };
        return userCopy;
    }
}
