// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
} from "typeorm";
import { MapContent } from "../builtMap/MapContent";

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
		enum: ["visitor", "writer", "admin"],
		default: "visitor",
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
}
