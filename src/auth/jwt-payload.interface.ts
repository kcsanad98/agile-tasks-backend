import { Schema as MongooseSchema } from 'mongoose';

export interface JwTPayload {
    email: string;
    id: MongooseSchema.Types.ObjectId;
}
