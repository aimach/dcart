// import des bibliothèques
import { Entity, Column, BaseEntity } from "typeorm";

@Entity()
export class Divinity extends BaseEntity {
	@Column({ type: "text" })
	divinity_list?: string;
}
