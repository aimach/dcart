// import des bibliothèques
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Translation extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: number;

	@Column({ type: "varchar", unique: true })
	language!: string;

	@Column({ type: "jsonb" })
	translations!: Record<string, string>;
}
