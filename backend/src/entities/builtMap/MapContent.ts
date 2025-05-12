// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	BaseEntity,
	ManyToOne,
	OneToMany,
	ManyToMany,
} from "typeorm";
// import des entités
import { FilterMapContent } from "./FilterMapContent";
import { User } from "../auth/User";
import { Tag } from "../common/Tag";
import { Attestation } from "../common/Attestation";

@Entity()
export class MapContent extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	title_fr!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	title_en!: string;

	@Column({ type: "text", nullable: true })
	description_fr?: string | null;

	@Column({ type: "text", nullable: true })
	description_en?: string | null;

	@Column({ type: "text", nullable: true })
	image_url?: string | null;

	@Column({ type: "text", unique: true, nullable: false })
	slug!: string;

	@Column({ type: "boolean", default: false })
	divinity_in_chart?: boolean;

	// booléen si la carte est active ou non (càd, publiée)
	@Column({ type: "boolean", default: false })
	isActive!: boolean;

	// booléen si les points de la carte s'affichent en couches
	@Column({ type: "boolean", default: false })
	isLayered!: boolean;

	// booléen pour afficher le nombre de sources
	@Column({ type: "boolean", default: true })
	isNbDisplayed!: boolean;

	@CreateDateColumn({ type: "timestamptz" })
	createdAt!: Date;

	@UpdateDateColumn({ type: "timestamptz" })
	updatedAt!: Date;

	@Column({ type: "date", nullable: false })
	uploadPointsLastDate!: Date;

	@OneToMany(
		() => Attestation,
		(attestation) => attestation.map,
	)
	attestations!: Attestation[];

	@ManyToOne(
		() => User,
		(user) => user.createdMaps,
		{
			onDelete: "SET NULL",
			nullable: true,
		},
	)
	creator?: User | null;

	@ManyToOne(
		() => User,
		(user) => user.updatedMaps,
		{
			onDelete: "SET NULL",
			nullable: true,
		},
	)
	modifier?: User | null;

	@ManyToMany(
		() => Tag,
		(tag) => tag.maps,
		{ cascade: true, onDelete: "CASCADE" },
	)
	tags!: Tag[];

	@OneToMany(
		() => FilterMapContent,
		(filterMapContent) => filterMapContent.map,
		{
			cascade: true,
			onDelete: "CASCADE",
		},
	)
	filterMapContent?: FilterMapContent[];
}
