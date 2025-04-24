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

@Entity()
export class Filter extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({
		type: "varchar",
		nullable: false,
	})
	type?: string;

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
