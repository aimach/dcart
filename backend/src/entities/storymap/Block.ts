// import des bibilothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

// import des entités
import { Storymap } from "./Storymap";
import { Point } from "./Point";
import { Type } from "./Type";

@Entity()
export class Block extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "text", nullable: false })
	content1_fr!: string;

	@Column({ type: "text", nullable: false })
	content1_en!: string;

	@Column({ type: "text", nullable: true })
	content2_fr!: string | null;

	@Column({ type: "text", nullable: true })
	content2_en!: string | null;

	@Column({ type: "int", nullable: true })
	position!: number | null;

	@CreateDateColumn({ type: "timestamptz" })
	createdAt!: Date;

	@UpdateDateColumn({ type: "timestamptz" })
	updatedAt!: Date;

	@ManyToOne(
		() => Storymap,
		(storymap) => storymap.blocks,
		{ onDelete: "CASCADE" },
	)
	storymap!: Storymap;

	@ManyToOne(
		() => Type,
		(type) => type.blocks,
	)
	type!: Type;

	@OneToMany(
		() => Point,
		(point) => point.block,
		{ cascade: true },
	)
	points!: Point[];

	@ManyToOne(
		() => Block,
		(block) => block.children,
		{ nullable: true, onDelete: "CASCADE" },
	)
	parent!: Block | null;

	@OneToMany(
		() => Block,
		(block) => block.parent,
		{ cascade: true },
	)
	children!: Block[];
}
