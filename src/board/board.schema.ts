import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BoardDocument = Board & Document;

@Schema()
export class Board {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    id: string;

    @Prop()
    title: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
    users: User[];

    constructor(title?: string) {
        this.title = title;
    }
}

export const BoardSchema = SchemaFactory.createForClass(Board);
