import { BaseEntity, Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm';
import { UserBoard } from './user-board.entity';

@Entity()
export class Board extends BaseEntity {
    @ObjectIdColumn({ primary: true })
    id: string;

    @Column()
    title: string;

    constructor(title?: string) {
        super();
        this.title = title;
    }
}
