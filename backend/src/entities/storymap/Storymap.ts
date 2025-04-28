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
	ManyToMany,
} from "typeorm";
// import des entités
import { Block } from "./Block";
import { Tag } from "../common/Tag";
import { User } from "../auth/User";
import { Language } from "./Language";

@Entity()
export class Storymap extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	title_lang1!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	title_lang2!: string;

	@Column({ type: "text", nullable: false })
	description_lang1!: string;

	@Column({ type: "text", nullable: false })
	description_lang2!: string;

	@Column({ type: "text", nullable: true })
	image_url!: string | null;

	@Column({ type: "text", nullable: true })
	slug!: string | null;

	@Column({ type: "varchar", length: 255, nullable: true })
	author!: string | null;

	@Column({ type: "varchar", length: 255, nullable: true })
	publishedAt!: string | null;

	@Column({ type: "date", nullable: true })
	uploadPointsLastDate?: Date;

	// booléen si la carte est publiée ou non
	@Column({ type: "boolean", default: false })
	isActive!: boolean;

	@CreateDateColumn({ type: "timestamptz" })
	createdAt!: Date;

	@UpdateDateColumn({ type: "timestamptz" })
	updatedAt!: Date;

	@ManyToOne(
		() => User,
		(user) => user.createdStorymaps,
		{
			onDelete: "SET NULL",
			nullable: true,
		},
	)
	creator?: User | null;

	@ManyToOne(
		() => User,
		(user) => user.updatedStorymaps,
		{
			onDelete: "SET NULL",
			nullable: true,
		},
	)
	modifier?: User | null;

	@OneToMany(
		() => Block,
		(block) => block.storymap,
		{ cascade: true },
	)
	blocks!: Block[];

	@ManyToMany(
		() => Tag,
		(tag) => tag.storymaps,
		{ cascade: true, onDelete: "CASCADE" },
	)
	tags!: Tag[];

	@ManyToOne(() => Language, { nullable: false })
	lang1!: Language;

	@ManyToOne(() => Language, { nullable: true })
	lang2?: Language;
}
