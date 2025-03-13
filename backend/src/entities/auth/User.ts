// import des bibliothèques
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: number;

	@Column({ type: "varchar", length: 255, nullable: false })
	pseudo!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	username!: string;

	@Column({ type: "varchar", nullable: false })
	password!: string;

	@Column({
		type: "enum",
		enum: ["visitor", "writer", "admin"],
		default: "visitor",
	})
	status!: string;
}
