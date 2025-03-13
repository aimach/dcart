// import des bibliothèques
import { Entity, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm";
// import des entités
import { User } from "./User";

@Entity()
export class RefreshToken extends BaseEntity {
	@Column({ primary: true, type: "uuid" })
	id!: string;

	@Column({ type: "text", nullable: false })
	token!: string;

	@OneToOne(() => User)
	@JoinColumn()
	userId!: User;
}
