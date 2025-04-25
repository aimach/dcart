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

type TagWithItemsType = {
	id: string;
	name_fr: string;
	name_en: string;
	description_fr: string;
	description_en: string;
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
		title_fr: string;
		title_en: string;
		description_fr: string;
		description_en: string;
		image_url: string;
		slug: string;
		tags: Omit<TagType[], "maps">;
	}[];
};

export type { NavList, OptionType, TagWithItemsType };
