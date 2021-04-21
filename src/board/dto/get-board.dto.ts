import { GetUserDto } from 'src/user/dto/get-user.dto';

export class GetBoardDto {
    id: string;
    title: string;
    users: { id: string; email: string }[];
}
