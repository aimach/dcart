import type { FormType } from "./formTypes";
import type { PointSetType } from "./mapTypes";

type StorymapType = {
	id: string;
	title_lang2: string;
	title_lang1: string;
	description_lang2: string;
	description_lang1: string;
	image_url?: string;
	background_color?: string;
	author?: string;
	isActive: boolean;
	publishedAt: string;
	lang1: { name: string; id: string };
	lang2: { name: string; id: string };
	slug: string;
	createdAt: string;
	updatedAt: string;
	uploadPointsLastDate: string;
	creator?: {
		username: string;
	};
	modifier?: {
		username: string;
	};
	blocks?: BlockContentType[];
	publication_date?: string;
	relatedMap?: string;
	tags?: TagType[] | string;
};

type StorymapBodyType = {
	id?: string;
	title_lang1: string;
	title_lang2: string;
	description_lang1: string;
	description_lang2: string;
	category_id: string;
	image_url: string;
	background_color: string;
	author: string;
	lang1: string;
	lang2: string;
	publication_date: string;
	tags: string;
};

type BlockContentType = {
	id: string;
	id_storymap: number;
	type: TypeType;
	id_parent: number;
	position?: number;
	content1_lang2: string;
	content1_lang1: string;
	content2_lang1: string;
	content2_lang2: string;
	content3?: string | null;
	points?: PointType[];
	groupedPoints?: GroupedTyped[];
	children: BlockContentType[];
	attestations?: PointSetType[];
};

type PointType = {
	id: number;
	latitude: number;
	longitude: number;
	great_region: string | null;
	sub_region: string | null;
	location: string | null;
	extraction: string | null;
	transliteration: string | null;
	translation_fr: string | null;
	translation_en: string | null;
	title_lang1: string | null;
	title_lang2: string | null;
	description_lang1: string | null;
	description_lang2: string | null;
	pane: string | null;
	color: string | null;
};

type GroupedTyped = {
	latitude: number;
	longitude: number;
	pane: string;
	attestations: PointType[];
	blockId?: number | string;
	color: string;
};

type TypeType = {
	id: string;
	name: FormType;
};

type TagType = {
	id: string;
	name_en: string;
	name_fr: string;
	description_en: string;
	description_fr: string;
};

type StorymapLanguageType = {
	id: string;
	name: string;
};

export type {
	StorymapType,
	BlockContentType,
	PointType,
	GroupedTyped,
	TypeType,
	TagType,
	StorymapLanguageType,
	StorymapBodyType,
};
