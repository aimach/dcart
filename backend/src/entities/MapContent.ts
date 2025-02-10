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

	// nombre d'éléments pour chaque attestation
	@Column({ type: "int" })
	elementNb!: number;

	// l'opérateur qui précède le nombre d'éléments (par exemple = 2, <= 3, etc.)
	@Column({ type: "varchar" })
	elementOperator!: string;

	// nombre de puissances divines (par exemple = 1, <= 2, etc.)
	@Column({ type: "int" })
	divinityNb!: number;

	//  l'opérateur qui précède le nombre de puissances divines (par exemple = 1, <= 2, etc.)
	@Column({ type: "varchar" })
	divinityOperator!: string;

	//  liste des éléments à inclure
	@Column({ type: "text", nullable: true })
	includedElements?: string | null;

	//  liste des éléments à exclure
	@Column({ type: "text", nullable: true })
	excludedElements?: string | null;

	// type de localité : cf. enum ci-dessus
	@Column({ type: "enum", enum: location, default: location.GREATREGION })
	locationType: string = location.GREATREGION;

	// id de la localité
	@Column({ type: "int" })
	locationId!: number;

	// repère chronologique ante
	@Column({ type: "int", nullable: true, default: null })
	ante?: number | null;

	// repère chronologique post
	@Column({ type: "int", nullable: true, default: null })
	post?: number | null;

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
