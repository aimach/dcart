// import des types
import type { OptionType } from "./commonTypes";
import type { BlockContentType } from "./storymapTypes";

type InputType = {
	label_fr: string;
	label_en: string;
	description_fr?: string;
	description_en?: string;
	name: string;
	type: string;
	options?: OptionType[];
	required: {
		value: boolean;
		message?: { fr: string; en: string };
	};
};

type blockType = {
	id?: string;
	content1_lang1: string;
	content1_lang2?: string;
	content2_lang1?: string | null;
	content2_lang2?: string | null;
	parentId?: string | null;
	storymapId?: string;
	typeId?: string;
	typeName?: string;
	children?: blockType[];
};

type parsedPointType = {
	latitude: number;
	longitude: number;
	great_region: string | null;
	sub_region: string | null;
	location: string | null;
	extraction: string | null;
	transliteration: string | null;
	translation_fr: string | null;
	pane?: string;
};

type FormType =
	| "blockChoice"
	| "title"
	| "subtitle"
	| "text"
	| "link"
	| "image"
	| "quote"
	| "layout"
	| "simple_map"
	| "comparison_map"
	| "scroll_map"
	| "separator"
	| "table";

type storymapInputsType = {
	title_lang1: string;
	title_lang2: string;
	description_lang1: string;
	description_lang2: string;
	image_url: string;
	author: string;
	publication_date: string;
	category_id: string;
	lang1: string;
	lang2: string;
	relatedMap: string;
};

type allInputsType = storymapInputsType | BlockContentType;

export type {
	InputType,
	FormType,
	blockType,
	parsedPointType,
	storymapInputsType,
	allInputsType,
};
