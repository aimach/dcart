// import des bibilothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";
// import des entités
import { Block } from "./Block";
import { Category } from "../builtMap/Category";

@Entity()
export class Storymap extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	title_fr!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	title_en!: string;

	@Column({ type: "text", nullable: false })
	description_fr!: string;

	@Column({ type: "text", nullable: false })
	description_en!: string;

	@Column({ type: "text", nullable: true })
	image_url!: string | null;

	@Column({ type: "varchar", length: 255, nullable: true })
	author!: string | null;

	@Column({ type: "varchar", length: 255, nullable: true })
	publishedAt!: string | null;

	@CreateDateColumn({ type: "timestamptz" })
	createdAt!: Date;

	@UpdateDateColumn({ type: "timestamptz" })
	updatedAt!: Date;

	@OneToMany(
		() => Block,
		(block) => block.storymap,
		{ cascade: true },
	)
	blocks!: Block[];

	@ManyToOne(
		() => Category,
		(category) => category.storymaps,
		{ onDelete: "SET NULL" },
	)
	category!: Category;
}
