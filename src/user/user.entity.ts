import { BaseEntity, Column, Entity, JoinTable, ObjectIdColumn, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Board } from 'src/board/board.entity';

@Entity()
export class User extends BaseEntity {
    @ObjectIdColumn({ primary: true })
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToMany(() => Board, board => board.owner, { eager: true })
    @JoinTable()
    ownedBoards: Board[];

    public constructor(email: string, password: string, salt: string) {
        super();
        this.email = email;
        this.password = password;
        this.salt = salt;
    }

    /**
     * Validates whether user typed in the correct password when trying to log in.
     *
     * @param {string} password - Password typed in by the user when logging in.
     * @returns {boolean} - Result of the check.
     */
    public async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}
