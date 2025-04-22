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
export class User extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	pseudo!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	username!: string;

	@Column({ type: "varchar", nullable: false })
	password!: string;

	@Column({
		type: "enum",
		enum: ["writer", "admin"],
		default: "writer",
	})
	status!: string;

	@OneToMany(
		() => MapContent,
		(mapContent) => mapContent.creator,
	)
	createdMaps!: MapContent[];

	@OneToMany(
		() => MapContent,
		(mapContent) => mapContent.modifier,
	)
	updatedMaps!: MapContent[];

	@OneToMany(
		() => Storymap,
		(storymap) => storymap.creator,
	)
	createdStorymaps!: Storymap[];

	@OneToMany(
		() => Storymap,
		(storymap) => storymap.modifier,
	)
	updatedStorymaps!: Storymap[];
}
