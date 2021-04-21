export class GetBoardDto {
    id: string;
    title: string;
    users: { id: string; email: string }[];
}
