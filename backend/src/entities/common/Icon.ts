// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
} from "typeorm";
// import des entités
import { Attestation } from "../common/Attestation";

@Entity()
export class Icon extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	name_fr!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	name_en!: string;

	@OneToMany(
		() => Attestation,
		(attestation) => attestation.icon,
	)
	attestations!: Attestation[];
}
