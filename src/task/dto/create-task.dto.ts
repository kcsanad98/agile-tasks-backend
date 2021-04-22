import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';
import { taskStatuses } from '../task.schema';
import { Schema as MongooseSchema } from 'mongoose';

const MIN_LENGTH = 1;
const MAX_LENGTH = 20;

export class CreateTaskDto {
    @IsString()
    @MinLength(MIN_LENGTH)
    @MaxLength(MAX_LENGTH)
    title: string;

    @IsString()
    @MinLength(MIN_LENGTH)
    @MaxLength(MAX_LENGTH)
    description: string;

    @IsString()
    @IsIn(taskStatuses)
    status: string;
}
