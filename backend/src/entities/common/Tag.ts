// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToMany,
	ManyToOne,
	JoinTable,
	JoinColumn,
} from "typeorm";
// import des entités
import { MapContent } from "../builtMap/MapContent";
import { Storymap } from "../storymap/Storymap";

@Entity()
export class Tag extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "varchar" })
	name_fr!: string;

	@Column({ type: "varchar" })
	name_en!: string;

	@Column({ type: "text", unique: true, nullable: false })
	slug!: string;

	@Column({ type: "text", nullable: true })
	description_fr: string | undefined | null;

	@Column({ type: "text", nullable: true })
	description_en: string | undefined | null;

	@ManyToMany(
		() => MapContent,
		(map) => map.tags,
	)
	@JoinTable()
	maps!: MapContent[];

	@ManyToMany(
		() => Storymap,
		(Storymap) => Storymap.tags,
	)
	@JoinTable()
	storymaps!: Storymap[];

	// storymap introductive, affichée en premier sur la page du tag
	@Column({ type: "uuid", nullable: true })
	intro_storymap_id: string | null | undefined;

	@ManyToOne(() => Storymap, { nullable: true, onDelete: "SET NULL" })
	@JoinColumn({ name: "intro_storymap_id" })
	intro_storymap: Storymap | null | undefined;
}
