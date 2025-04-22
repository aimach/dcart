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
import { Color } from "./Color";
import { MapContent } from "../builtMap/MapContent";
import { Block } from "../storymap/Block";

@Entity()
export class Attestation extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	name!: string;

	@Column({ type: "text", nullable: false })
	attestationIds!: string;

	@ManyToOne(
		() => Icon,
		(icon) => icon.attestations,
		{ nullable: true },
	)
	icon?: Icon;

	@ManyToOne(
		() => Color,
		(color) => color.attestations,
		{ nullable: true },
	)
	color?: Color;

	@ManyToOne(
		() => MapContent,
		(MapContent) => MapContent.attestations,
		{ cascade: true, onDelete: "CASCADE", nullable: true },
	)
	map?: MapContent | null;

	@ManyToOne(
		() => Block,
		(Block) => Block.attestations,
		{ cascade: true, onDelete: "CASCADE", nullable: true },
	)
	block?: Block | null;
}
