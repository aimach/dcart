// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToMany,
} from "typeorm";
// import des entités
import { MapContent } from "./MapContent";

export enum FilterType {
	TIME = "time",
	ELEMENT = "element",
	LOCATION = "location",
	LANGUAGE = "language",
	DIVINITYNB = "divinityNb",
}

@Entity()
export class Filter extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({
		type: "enum",
		enum: FilterType,
		default: FilterType.TIME,
	})
	type?: FilterType;

	@ManyToMany(() => MapContent)
	maps?: MapContent[];
}
