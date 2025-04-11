// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
} from "typeorm";
// import des entités
import { MapContent } from "./MapContent";
import { Filter } from "./Filter";

@Entity()
export class FilterMapContent extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: string;

	@Column({
		type: "json",
		nullable: true,
	})
	options?: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		[key: string]: any;
	} | null;

	@ManyToOne(() => MapContent, map => map.filterMapContent, { onDelete: "CASCADE" })
	map?: MapContent;

	@ManyToOne(() => Filter, filter => filter.filterMapContent, { onDelete: "CASCADE" })
	filter?: Filter;
}
