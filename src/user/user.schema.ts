import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Exclude } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ type: MongooseSchema.Types.ObjectId })
    id: MongooseSchema.Types.ObjectId;

    @Prop({ unique: true })
    email: string;

    @Prop()
    @Exclude()
    password: string;

    @Prop()
    @Exclude()
    salt: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Board' }] })
    boards: MongooseSchema.Types.ObjectId[];

    public constructor(email?: string, password?: string, salt?: string) {
        this.email = email;
        this.password = password;
        this.salt = salt;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);
