// import des bibliothèques
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Translation extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar", unique: true, nullable: false })
	key!: string;

	@Column({ type: "text", nullable: false })
	fr!: string;

	@Column({ type: "text", nullable: false })
	en!: string;

	@Column({ type: "text", nullable: true })
	appLink?: string | null;
}
