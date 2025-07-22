// import des bibliothèques
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class NoContentText extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "text", nullable: false })
	content_fr!: string;

	@Column({ type: "text", nullable: false })
	content_en!: string;
}
