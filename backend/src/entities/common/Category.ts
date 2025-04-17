// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
} from "typeorm";
// import des entités
import { MapContent } from "../builtMap/MapContent";
import { Storymap } from "../storymap/Storymap";

@Entity()
export class Category extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar" })
	name_fr!: string;

	@Column({ type: "varchar" })
	name_en!: string;

	@Column({ type: "text", nullable: true })
	description_fr: string | undefined | null;

	@Column({ type: "text", nullable: true })
	description_en: string | undefined | null;

	@OneToMany(
		() => MapContent,
		(map) => map.category,
	)
	maps!: MapContent[];

	@OneToMany(
		() => Storymap,
		(Storymap) => Storymap.category,
		{ cascade: true },
	)
	storymaps!: Storymap[];
}
