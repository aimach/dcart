// import des bibliothèques
import { Entity, BaseEntity, PrimaryColumn } from "typeorm";
// import des données
import divinityList from "../../utils/divinityList/divinityList";

@Entity()
export class Divinity extends BaseEntity {
	@PrimaryColumn({ type: "text", default: divinityList })
	divinity_list?: string;
}
