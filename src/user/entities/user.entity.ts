import { Exclude } from "class-transformer";
import { Role } from "src/role/entities/role.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string

    @Column()
    lastname: string

    @Column()
    @Unique(['email'])
    email: string

    @Column()
    @Exclude()
    password: string

    @Column({ default: true })
    isActive: boolean

   
    @ManyToOne(() => Role, (role) => role.users)
    role: Role
}
