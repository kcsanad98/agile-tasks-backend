import { User } from 'src/user/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, ObjectIdColumn } from 'typeorm';

@Entity()
export class Board extends BaseEntity {
    @ObjectIdColumn({ primary: true })
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => User, owner => owner.ownedBoards, { eager: false })
    owner: User;

    constructor(title: string) {
        super();
        this.title = title;
    }
}
