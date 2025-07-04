// import des services
import { getAllTagsWithMapsAndStorymaps } from "../api/builtMap/getRequests";
// import des types
import type { MutableRefObject } from "react";
import type {
	ItemTypeCheckboxType,
	OptionType,
	PaginationObjectType,
	TagWithItemsAndPagination,
	TagWithItemsType,
} from "../types/commonTypes";
import type { MultiValue } from "react-select";
import { LanguageObject } from "../types/languageTypes";

const scrollToTagContainer = (
	tagContainerRef: MutableRefObject<HTMLDivElement | null>,
) => {
	tagContainerRef.current?.scrollIntoView({ behavior: "smooth" });
};

const fetchAllTagsWithMapsAndStorymaps = async (
	itemTypes: ItemTypeCheckboxType,
	paginationObject: PaginationObjectType,
	setAllTagsWithItems: (tags: TagWithItemsType[]) => void,
	setPaginationObject: (pagination: PaginationObjectType) => void,
	searchText = "",
	tagArray = [] as MultiValue<OptionType>,
) => {
	const { items, pagination }: TagWithItemsAndPagination =
		await getAllTagsWithMapsAndStorymaps(
			itemTypes,
			searchText,
			tagArray,
			paginationObject,
		);

	const sortedTags = items.sort((a, b) => {
		const mapsNbA = a.maps ? a.maps.length : 0;
		const mapsNbB = b.maps ? b.maps.length : 0;
		const storymapsNbA = a.storymaps ? a.storymaps.length : 0;
		const storymapsNbB = b.storymaps ? b.storymaps.length : 0;
		return mapsNbB + storymapsNbB - (mapsNbA + storymapsNbA);
	});
	setAllTagsWithItems(sortedTags);
	setPaginationObject(pagination);
};

const fetchAllTagsForSelectOption = async (
	itemTypes: ItemTypeCheckboxType,
	paginationObject: PaginationObjectType,
	language: "fr" | "en",
	setAllTagsOptions: (options: OptionType[]) => void,
	setPaginationObject: (pagination: PaginationObjectType) => void,
) => {
	const { items, pagination }: TagWithItemsAndPagination =
		await getAllTagsWithMapsAndStorymaps(itemTypes, "", [], paginationObject);
	if (items.length > 0) {
		const options = items
			.filter((tag) => tag.maps?.length !== 0 || tag.storymaps?.length !== 0)
			.map((tag) => ({
				value: tag.slug,
				label: tag[`name_${language}`],
			}));
		setAllTagsOptions(options);
		setPaginationObject(pagination);
	}
};

const handleCheckboxChange = async (
	e: React.ChangeEvent<HTMLInputElement>,
	type: "map" | "storymap",
	itemTypes: ItemTypeCheckboxType,
	setItemTypes: (itemTypeprevs: ItemTypeCheckboxType) => void,
) => {
	const otherType = type === "map" ? "storymap" : "map";
	if (!e.target.checked && !itemTypes[otherType]) {
		setItemTypes({
			[otherType]: true,
			[type]: e.target.checked,
		} as ItemTypeCheckboxType);
		return;
	}
	const newItemTypes: ItemTypeCheckboxType = {
		...itemTypes,
		[type]: e.target.checked,
	};
	setItemTypes(newItemTypes);
};

const handleFilterInputs = (
	searchText: string,
	setSearchText: (text: string) => void,
	setSelectedTags: (tags: MultiValue<OptionType>) => void,
	tagArray: MultiValue<OptionType>,
	itemTypes: ItemTypeCheckboxType,
	paginationObject: PaginationObjectType,
	setAllTagsWithItems: (tags: TagWithItemsType[]) => void,
	setPaginationObject: (pagination: PaginationObjectType) => void,
) => {
	setSearchText(searchText);
	setSelectedTags(tagArray);
	fetchAllTagsWithMapsAndStorymaps(
		itemTypes,
		paginationObject,
		setAllTagsWithItems,
		setPaginationObject,
		searchText,
		tagArray,
	);
};

const isEmptyResult = (allTagsWithItems: TagWithItemsType[]) => {
	if (allTagsWithItems.length === 0) return true;
	return allTagsWithItems.every((tagWithItems: TagWithItemsType) => {
		const maps = tagWithItems.maps || [];
		const storymaps = tagWithItems.storymaps || [];
		return maps.length === 0 && storymaps.length === 0;
	});
};

export {
	scrollToTagContainer,
	fetchAllTagsWithMapsAndStorymaps,
	fetchAllTagsForSelectOption,
	handleCheckboxChange,
	handleFilterInputs,
	isEmptyResult,
};
