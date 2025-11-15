// import des bibilothèques
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
import { Tag } from "../common/Tag";
import { Block } from "./Block";
import { Language } from "./Language";

@Entity()
export class Storymap extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", nullable: false })
  title_lang1!: string;

  @Column({ type: "text", nullable: true })
  title_lang2?: string | null;

  @Column({ type: "text", nullable: false })
  description_lang1!: string;

  @Column({ type: "text", nullable: true })
  description_lang2?: string | null;

  @Column({ type: "text", nullable: true })
  image_url!: string | null;

  @Column({ type: "varchar", nullable: true })
  background_color!: string | null;

  @Column({ type: "text", nullable: true })
  slug!: string | null;

  @Column({ type: "text", nullable: true })
  author!: string | null;

  @Column({ type: "text", nullable: true })
  author_status!: string | null;

  @Column({ type: "text", nullable: true })
  author_email!: string | null;

  @Column({ type: "text", nullable: true })
  publishedAt!: string | null;

  @Column({ type: "date", nullable: true })
  uploadPointsLastDate?: Date;

  // booléen si la carte est publiée ou non
  @Column({ type: "boolean", default: false })
  isActive!: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.createdStorymaps, {
    onDelete: "SET NULL",
    nullable: true,
  })
  creator?: User | null;

  @ManyToOne(() => User, (user) => user.updatedStorymaps, {
    onDelete: "SET NULL",
    nullable: true,
  })
  modifier?: User | null;

  @OneToMany(() => Block, (block) => block.storymap, { cascade: true })
  blocks!: Block[];

  @ManyToMany(() => Tag, (tag) => tag.storymaps, {
    cascade: true,
    onDelete: "CASCADE",
  })
  tags!: Tag[];

  @ManyToOne(() => Language, { nullable: false })
  lang1!: Language;

  @ManyToOne(() => Language, { nullable: true })
  lang2?: Language;
}
