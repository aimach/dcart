// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	BaseEntity,
} from "typeorm";

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
	name!: string;

	@Column({ type: "text" })
	description?: string | null;

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

	// type de localité : cf. enum ci-dessus
	@Column({ type: "enum", enum: location, default: location.GREATREGION })
	locationType: string = location.GREATREGION;

	// id de la localité
	@Column({ type: "int" })
	locationId!: number;

	// repère chronologique ante
	@Column({ type: "int", default: null })
	ante?: number;

	// repère chronologique post
	@Column({ type: "int", default: null })
	post?: number;

	// booléen si la carte est active ou non (càd, publiée)
	@Column({ type: "boolean", default: false })
	isActive!: boolean;

	@CreateDateColumn({ type: "timestamptz" })
	createdAt!: Date;

	@UpdateDateColumn({ type: "timestamptz" })
	updatedAt!: Date;
}
