import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BoardDocument = Board & Document;

@Schema()
export class Board {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    id: string;

    @Prop()
    title: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
    users: MongooseSchema.Types.ObjectId[];

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Task' }] })
    tasks: MongooseSchema.Types.ObjectId[];

    constructor(title?: string) {
        this.title = title;
    }
}

export const BoardSchema = SchemaFactory.createForClass(Board);
