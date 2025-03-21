// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
} from "typeorm";
// import des entités
import { Storymap } from "./Storymap";

@Entity()
export class Language extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	name!: string;

	@OneToMany(
		() => Storymap,
		(storymap) => storymap.lang1,
	)
	storymaps_lang1!: Storymap[];

	@OneToMany(
		() => Storymap,
		(storymap) => storymap.lang2,
	)
	storymaps_lang2!: Storymap[];
}
