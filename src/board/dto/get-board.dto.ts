import { GetTaskDto } from 'src/task/dto/get-task.dto';

export class GetBoardDto {
    id: string;
    title: string;
    users: { id: string; email: string }[];
    tasks: GetTaskDto[];
}
