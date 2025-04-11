// import des bibilothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
} from "typeorm";
// import des entités
import { Block } from "./Block";

export enum pane {
	LEFT = "left",
	RIGHT = "right",
}

@Entity()
export class Point extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "float", nullable: false })
	latitude!: number;

	@Column({ type: "float", nullable: false })
	longitude!: number;

	@Column({ type: "text", nullable: true })
	great_region!: string | null;

	@Column({ type: "text", nullable: true })
	sub_region!: string | null;

	@Column({ type: "text", nullable: true })
	location!: string | null;

	@Column({ type: "text", nullable: true })
	extraction!: string | null;

	@Column({ type: "text", nullable: true })
	transliteration!: string | null;

	@Column({ type: "text", nullable: true })
	translation_fr!: string | null;

	@Column({ type: "text", nullable: true })
	translation_en!: string | null;

	@Column({ type: "text", nullable: true })
	title_lang1!: string | null;

	@Column({ type: "text", nullable: true })
	title_lang2!: string | null;

	@Column({ type: "text", nullable: true })
	description_lang1!: string | null;

	@Column({ type: "text", nullable: true })
	description_lang2!: string | null;

	@Column({ type: "text", nullable: true })
	color!: string | null;

	@Column({ type: "enum", enum: pane, nullable: true })
	pane!: pane;

	@ManyToOne(
		() => Block,
		(block) => block.points,
		{ onDelete: "CASCADE" },
	)
	block!: Block;
}
