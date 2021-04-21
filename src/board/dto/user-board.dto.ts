import { Schema as MongooseSchema } from 'mongoose';

export class UserBoardDto {
    userId: MongooseSchema.Types.ObjectId;
    boardId: MongooseSchema.Types.ObjectId;
}
