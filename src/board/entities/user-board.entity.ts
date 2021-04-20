import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class UserBoard extends BaseEntity {
    @ObjectIdColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    boardId: string;
}
