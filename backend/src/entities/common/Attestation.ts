// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
	OneToMany,
} from "typeorm";
// import des entités
import { Icon } from "./Icon";
import { Color } from "./Color";
import { MapContent } from "../builtMap/MapContent";
import { Block } from "../storymap/Block";
import { Point } from "../storymap/Point";

@Entity()
export class Attestation extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	name_fr!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	name_en!: string;

	@Column({ type: "text", nullable: false })
	attestationIds!: string;

	@Column({ type: "timestamp", nullable: true })
	lastActivity!: Date;

	@Column({ type: "int" })
	position!: number;

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

	@OneToMany(
		() => Point,
		(point) => point.attestation,
		{ nullable: true },
	)
	customPointsArray?: Point[] | null;
}
