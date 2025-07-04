import type { TagType } from "./mapTypes";

type NavList = {
	id: string;
	title: string | JSX.Element;
	description?: string;
	onClickFunction: undefined | (() => void);
	route: undefined | string;
	adminOnly?: boolean;
}[];

type OptionType = { value: number | string; label: string };

type TagWithItemsAndPagination = {
	items: TagWithItemsType[];
	pagination: {
		page: number;
		limit: number;
		hasMore: boolean;
	};
};

type TagWithItemsType = {
	id: string;
	name_fr: string;
	name_en: string;
	description_fr: string;
	description_en: string;
	slug: string;
	maps: {
		id: string;
		title_fr: string;
		title_en: string;
		description_fr: string;
		description_en: string;
		image_url: string;
		slug: string;
		tags: Omit<TagType[], "maps">;
	}[];
	storymaps: {
		id: string;
		title_lang1: string;
		title_lang2: string;
		description_lang1: string;
		description_lang2: string;
		image_url: string;
		background_color: string;
		slug: string;
		tags: Omit<TagType[], "maps">;
	}[];
};

type ItemTypeCheckboxType = { map: boolean; storymap: boolean };

type PaginationObjectType = {
	page: number;
	limit: number;
	hasMore: boolean;
};

export type {
	NavList,
	OptionType,
	TagWithItemsType,
	TagWithItemsAndPagination,
	ItemTypeCheckboxType,
	PaginationObjectType,
};
