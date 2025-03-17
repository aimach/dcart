// import des bibliothèques
import {
	Entity,
	PrimaryGeneratedColumn,
	BaseEntity,
	OneToOne,
	JoinColumn,
	Column,
} from "typeorm";
// import des entités
import { MapContent } from "../builtMap/MapContent";
import { Storymap } from "../storymap/Storymap";
import { User } from "../auth/User";

@Entity()
export class UpdateSession extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@OneToOne(() => User)
	@JoinColumn()
	user!: User;

	@Column({ type: "timestamptz", nullable: false })
	createdAt!: Date;

	@OneToOne(() => MapContent)
	@JoinColumn()
	map!: MapContent;

	@OneToOne(() => Storymap)
	@JoinColumn()
	storymap!: Storymap;
}
