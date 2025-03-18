// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	BaseEntity,
	OneToOne,
	JoinColumn,
	Column,
	CreateDateColumn,
} from "typeorm";
// import des entités
import { User } from "../auth/User";

@Entity()
export class UpdateSession extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@OneToOne(() => User)
	@JoinColumn()
	user!: User;

	@CreateDateColumn({ type: "timestamptz", nullable: false })
	createdAt!: Date;

	@Column({ type: "uuid", nullable: false })
	itemId!: string;
}
