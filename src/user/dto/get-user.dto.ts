import { Board } from 'src/board/board.schema';

export class GetUserDto {
    id: string;
    email: string;
    boards: { id: string; title: string }[];
}
