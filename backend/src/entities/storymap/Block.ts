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
import { Type } from "./Type";
import { Attestation } from "../common/Attestation";

@Entity()
export class Block extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "text", nullable: false })
	content1_lang1!: string;

	@Column({ type: "text", nullable: false })
	content1_lang2!: string;

	@Column({ type: "text", nullable: true })
	content2_lang1!: string | null;

	@Column({ type: "text", nullable: true })
	content2_lang2!: string | null;

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
		() => Attestation,
		(attestation) => attestation.block,
		{ nullable: true, onDelete: "CASCADE" },
	)
	attestations?: Attestation[] | null;

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
