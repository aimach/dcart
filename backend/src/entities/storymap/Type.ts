// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
} from "typeorm";
// import des entités
import { Block } from "./Block";

@Entity()
export class Type extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar", length: 255, nullable: true })
	name!: string;

	@OneToMany(
		() => Block,
		(block) => block.type,
	)
	blocks!: Block[];
}
