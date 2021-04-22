import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TaskDocument = Task & Document;
export const taskStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];

@Schema()
export class Task {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    id: MongooseSchema.Types.ObjectId;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop({ enum: taskStatuses })
    status: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Board' }] })
    board: MongooseSchema.Types.ObjectId[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
