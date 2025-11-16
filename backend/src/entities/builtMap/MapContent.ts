// import des bibliothèques
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
// import des entités
import { User } from "../auth/User";
import { Attestation } from "../common/Attestation";
import { Tag } from "../common/Tag";
import { FilterMapContent } from "./FilterMapContent";

@Entity()
export class MapContent extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", nullable: false })
  title_fr!: string;

  @Column({ type: "text", nullable: false })
  title_en!: string;

  @Column({ type: "text", nullable: true })
  description_fr?: string | null;

  @Column({ type: "text", nullable: true })
  description_en?: string | null;

  @Column({ type: "text", nullable: true })
  image_url?: string | null;

  @Column({ type: "text", unique: true, nullable: false })
  slug!: string;

  @Column({ type: "boolean", default: false })
  divinity_in_chart?: boolean;

  // booléen si la carte est active ou non (càd, publiée)
  @Column({ type: "boolean", default: false })
  isActive!: boolean;

  // booléen si les points de la carte s'affichent en couches
  @Column({ type: "boolean", default: false })
  isLayered!: boolean;

  // booléen pour afficher le nombre de sources
  @Column({ type: "boolean", default: true })
  isNbDisplayed!: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @Column({ type: "date", nullable: false })
  uploadPointsLastDate!: Date;

  @OneToMany(() => Attestation, (attestation) => attestation.map)
  attestations!: Attestation[];

  @ManyToOne(() => User, (user) => user.createdMaps, {
    onDelete: "SET NULL",
    nullable: true,
  })
  creator?: User | null;

  @ManyToOne(() => User, (user) => user.updatedMaps, {
    onDelete: "SET NULL",
    nullable: true,
  })
  modifier?: User | null;

  @ManyToMany(() => Tag, (tag) => tag.maps, {
    cascade: true,
    onDelete: "CASCADE",
  })
  tags!: Tag[];

  @OneToMany(
    () => FilterMapContent,
    (filterMapContent) => filterMapContent.map,
    {
      cascade: true,
      onDelete: "CASCADE",
    }
  )
  filterMapContent?: FilterMapContent[];
}
