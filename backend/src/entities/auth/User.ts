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

	@Column({ type: "varchar", length: 255, nullable: false, unique: true })
	pseudo!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	username!: string;

	@Column({ type: "varchar", length: 255, nullable: false, unique: true })
	email!: string;

	@Column({ type: "varchar", nullable: true })
	password!: string | null;

	@Column({
		type: "enum",
		enum: ["writer", "admin"],
		default: "writer",
	})
	status!: string;

	@Column({ type: "text", nullable: true })
	resetToken?: string | null;

	@Column({ type: "timestamp", nullable: true })
	resetTokenExpiration?: Date | null;

	@OneToMany(
		() => MapContent,
		(mapContent) => mapContent.creator,
		{
			onDelete: "SET NULL",
		},
	)
	createdMaps!: MapContent[];

	@OneToMany(
		() => MapContent,
		(mapContent) => mapContent.modifier,
		{
			onDelete: "SET NULL",
		},
	)
	updatedMaps!: MapContent[];

	@OneToMany(
		() => Storymap,
		(storymap) => storymap.creator,
		{
			onDelete: "SET NULL",
		},
	)
	createdStorymaps!: Storymap[];

	@OneToMany(
		() => Storymap,
		(storymap) => storymap.modifier,
		{
			onDelete: "SET NULL",
		},
	)
	updatedStorymaps!: Storymap[];
}
