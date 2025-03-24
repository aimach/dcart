// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
	ManyToOne,
} from "typeorm";
import { Attestation } from "./Attestation";

@Entity()
export class Icon extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	name!: string;

	@Column({ type: "text", nullable: false })
	code_svg!: string;

	@OneToMany(
		() => Attestation,
		(attestation) => attestation.icon,
	)
	attestations!: Attestation[];
}
