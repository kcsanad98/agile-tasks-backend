import { BaseEntity, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class Task extends BaseEntity {
    @ObjectIdColumn({ primary: true })
    id: number;
}
