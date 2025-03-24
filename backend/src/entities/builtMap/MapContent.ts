// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	BaseEntity,
	ManyToOne,
	ManyToMany,
	JoinTable,
	OneToMany,
} from "typeorm";
import { Category } from "./Category";
import { Filter } from "./Filter";
import { User } from "../auth/User";
import { Attestation } from "./Attestation";

enum location {
	SUBREGION = "subRegion",
	GREATREGION = "greatRegion",
	CITY = "city",
}

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
	image_url!: string | null;

	@Column({ type: "text", nullable: true })
	divinityIds?: string | null;

	// booléen si la carte est active ou non (càd, publiée)
	@Column({ type: "boolean", default: false })
	isActive!: boolean;

	// booléen si les points de la carte s'affichent en couches
	@Column({ type: "boolean", default: false })
	isLayered!: boolean;

	@CreateDateColumn({ type: "timestamptz" })
	createdAt!: Date;

	@UpdateDateColumn({ type: "timestamptz" })
	updatedAt!: Date;

	@Column({ type: "date", nullable: false })
	uploadPointsLastDate!: Date;

	@Column({ type: "uuid", default: null, nullable: true })
	relatedStorymap?: string | null;

	@OneToMany(
		() => Attestation,
		(attestation) => attestation.map,
	)
	attestations!: Attestation[];

	@ManyToOne(
		() => User,
		(user) => user.createdMaps,
	)
	creator!: User;

	@ManyToOne(
		() => User,
		(user) => user.updatedMaps,
	)
	modifier!: User;

	@ManyToOne(
		() => Category,
		(category) => category.maps,
	)
	category!: Category;

	@ManyToMany(() => Filter, {
		cascade: true,
		onDelete: "CASCADE",
	}) // cascade: true permet d'insérer directement les filtres lors de la création de la carte
	@JoinTable({ name: "map_filter" })
	filters?: Filter[];
}
