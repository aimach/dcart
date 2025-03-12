import type { FormType } from "./formTypes";

type StorymapType = {
	id: string;
	title_en: string;
	title_fr: string;
	description_en: string;
	description_fr: string;
	image_url?: string;
	author?: string;
	isActive: boolean;
	publishedAt: string;
	blocks?: BlockContentType[];
};

type BlockContentType = {
	id: string;
	id_storymap: number;
	type: TypeType;
	id_parent: number;
	position?: number;
	content1_en: string;
	content1_fr: string;
	content2_en: string;
	content2_fr: string;
	points?: PointType[];
	groupedPoints?: GroupedTyped[];
	children: BlockContentType[];
};

type PointType = {
	id: number;
	latitude: number;
	longitude: number;
	great_region: string | null;
	sub_region: string | null;
	site: string | null;
	extraction: string | null;
	transliteration: string | null;
	translation_fr: string | null;
	translation_en: string | null;
	title_fr: string | null;
	title_en: string | null;
	description_en: string | null;
	description_fr: string | null;
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

type CategoryType = {
	id: string;
	name_en: string;
	name_fr: string;
	description_en: string;
	description_fr: string;
};

export type {
	StorymapType,
	BlockContentType,
	PointType,
	GroupedTyped,
	TypeType,
	CategoryType,
};
