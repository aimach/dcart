// import des bibliothèques
import { Entity, BaseEntity, PrimaryColumn } from "typeorm";

@Entity()
export class Divinity extends BaseEntity {
	@PrimaryColumn({ type: "text" })
	divinity_list?: string;
}
