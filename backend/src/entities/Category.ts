// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
} from "typeorm";
import { MapContent } from "./MapContent";

@Entity()
export class Category extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: number;

	@Column({ type: "varchar" })
	name!: string;

	@Column({ type: "text" })
	description: string | undefined;

	@OneToMany(
		() => MapContent,
		(map) => map.category,
	)
	maps!: MapContent[];
}
