import { IsString, MaxLength, MinLength } from 'class-validator';

const MIN_LENGTH = 1;
const MAX_LENGTH = 20;

export class CreateBoardDto {
    @IsString()
    @MinLength(MIN_LENGTH)
    @MaxLength(MAX_LENGTH)
    title: string;
}
