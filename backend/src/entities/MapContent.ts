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
} from "typeorm";
import { Category } from "./Category";
import { Filter } from "./Filter";

enum location {
	SUBREGION = "subRegion",
	GREATREGION = "greatRegion",
	CITY = "city",
}

@Entity()
export class MapContent extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar" })
	name_fr!: string;

	@Column({ type: "varchar" })
	name_en!: string;

	@Column({ type: "text", nullable: true })
	description_fr?: string | null;

	@Column({ type: "text", nullable: true })
	description_en?: string | null;

	@Column({ type: "text" })
	attestationIds!: string;

	// booléen si la carte est active ou non (càd, publiée)
	@Column({ type: "boolean", default: false })
	isActive!: boolean;

	@CreateDateColumn({ type: "timestamptz" })
	createdAt!: Date;

	@UpdateDateColumn({ type: "timestamptz" })
	updatedAt!: Date;

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
