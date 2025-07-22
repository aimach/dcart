// import des bibilothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
} from "typeorm";
// import des entités
import { Attestation } from "../common/Attestation";

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
	location!: string | null;

	@Column({ type: "integer", nullable: true })
	source_nb!: number | null;

	@ManyToOne(
		() => Attestation,
		(attestation) => attestation.customPointsArray,
		{ nullable: true, onDelete: "CASCADE" },
	)
	attestation?: Attestation | null;
}
