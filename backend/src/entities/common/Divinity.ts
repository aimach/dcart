// import des bibliothèques
import { Entity, BaseEntity, PrimaryColumn, Column } from "typeorm";
// import des données
import divinityList from "../../utils/divinityList/divinityList";

@Entity()
export class Divinity extends BaseEntity {
	@PrimaryColumn({ type: "varchar", default: 1 })
	id?: number;

	@Column({ type: "text", default: divinityList })
	divinity_list?: string;
}
