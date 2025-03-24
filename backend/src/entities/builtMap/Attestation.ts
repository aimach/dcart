// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
} from "typeorm";
// import des entités
import { Icon } from "./Icon";
import { Storymap } from "../storymap/Storymap";
import { MapContent } from "./MapContent";

@Entity()
export class Attestation extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	name!: string;

	@Column({ type: "text", nullable: false })
	attestationIds!: string;

	@Column({ type: "varchar", length: 255, nullable: true })
	color?: string;

	@ManyToOne(
		() => Icon,
		(icon) => icon.attestations,
		{ nullable: true },
	)
	icon?: Icon;

	@ManyToOne(
		() => MapContent,
		(MapContent) => MapContent.attestations,
		{ cascade: true, onDelete: "CASCADE" },
	)
	map!: MapContent;
}
