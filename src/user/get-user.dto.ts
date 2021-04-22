export class GetUserDto {
    id: string;
    email: string;
    boards: { id: string; title: string }[];
}
