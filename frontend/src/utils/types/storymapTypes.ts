import type { FormType } from "./formTypes";

type StorymapType = {
	id: string;
	title_lang2: string;
	title_lang1: string;
	description_lang2: string;
	description_lang1: string;
	image_url?: string;
	author?: string;
	isActive: boolean;
	publishedAt: string;
	lang1: { name: string };
	lang2: { name: string };
	createdAt: string;
	updatedAt: string;
	uploadPointsLastDate: string;
	creator: {
		pseudo: string;
	};
	modifier: {
		pseudo: string;
	};
	blocks?: BlockContentType[];
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
	location: string | null;
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
	CategoryType,
	StorymapLanguageType,
};
