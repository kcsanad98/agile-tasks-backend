import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User extends BaseEntity {
    @ObjectIdColumn({ primary: true })
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    public constructor(email?: string, password?: string, salt?: string) {
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
