import type { TagType } from "./mapTypes";

type NavList = {
	id: string;
	title: string | JSX.Element;
	description?: string;
	onClickFunction: undefined | (() => void);
	route: undefined | string;
	adminOnly?: boolean;
}[];

type OptionType = {
	value: number | string;
	label: string;
	isDisabled?: boolean;
};

// option du filtre "lieu" : on garde les grandes régions du lieu pour pouvoir filtrer la liste par région
type PlaceOptionType = OptionType & {
	greatRegionIds: string[];
};

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
	intro_storymap_id?: string | null;
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
	PlaceOptionType,
	TagWithItemsType,
	TagWithItemsAndPagination,
	ItemTypeCheckboxType,
	PaginationObjectType,
};
