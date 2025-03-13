// import des bibliothèques
import {
	Entity,
	Column,
	BaseEntity,
	OneToOne,
	JoinColumn,
	PrimaryGeneratedColumn,
} from "typeorm";
// import des entités
import { User } from "./User";

@Entity()
export class RefreshToken extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: number;

	@Column({ type: "text", nullable: false })
	token!: string;

	@OneToOne(() => User)
	@JoinColumn()
	user!: User;
}
