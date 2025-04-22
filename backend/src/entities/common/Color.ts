// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
} from "typeorm";
import { Attestation } from "./Attestation";
// import des entités

@Entity()
export class Color extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	name_fr!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	name_en!: string;

	@Column({ type: "varchar", nullable: false })
	code_hex!: string;

	@OneToMany(
		() => Attestation,
		(attestation) => attestation.icon,
	)
	attestations!: Attestation[];
}
