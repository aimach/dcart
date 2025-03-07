// import des bibliothèques
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Translation extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: number;

	@Column({ type: "varchar", unique: true })
	language!: string;

	@Column({ type: "json" }) // tester si c'est mieux entre JSON, JSONB ou TEXT
	// biome-ignore lint/suspicious/noExplicitAny: ignorer pour l'instant, en attente de création d'un custom type
	json!: any; // à modifier avec un custom type
}
