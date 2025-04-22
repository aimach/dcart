// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
} from "typeorm";
// import des entités
import { FilterMapContent } from "./FilterMapContent";

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

	@OneToMany(
		() => FilterMapContent,
		(filterMapContent) => filterMapContent.filter,
		{
			cascade: true,
			onDelete: "CASCADE",
		},
	) // cascade: true permet d'insérer directement les filtres lors de la création de la carte
	filterMapContent?: FilterMapContent[];
}
