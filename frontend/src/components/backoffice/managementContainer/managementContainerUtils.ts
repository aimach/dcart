// import des types
import type { UseFormResetField, UseFormWatch } from "react-hook-form";

const handleSearchInManagementTable = (
	data: { searchText: string },
	type: string,
	isMyItems: boolean,
	fetchMaps: (searchText: string, myItems: boolean) => Promise<void>,
	fetchStorymaps: (searchText: string, myItems: boolean) => Promise<void>,
) => {
	if (type === "map") {
		fetchMaps(data.searchText, isMyItems);
	}
	if (type === "storymap") {
		fetchStorymaps(data.searchText, isMyItems);
	}
};

const handleResetInManagementTable = (
	type: string,
	isMyItems: boolean,
	fetchMaps: (searchText: string, myItems: boolean) => Promise<void>,
	fetchStorymaps: (searchText: string, myItems: boolean) => Promise<void>,
	resetField: UseFormResetField<{ searchText: string }>,
) => {
	if (type === "map") {
		fetchMaps("", isMyItems);
	}
	if (type === "storymap") {
		fetchStorymaps("", isMyItems);
	}
	resetField("searchText");
};

const handleGetMyItemsInManagementTable = (
	type: string,
	isMyItems: boolean,
	setIsMyItems: (isMyItems: boolean) => void,
	watch: UseFormWatch<{ searchText: string }>,
	fetchMaps: (searchText: string, myItems: boolean) => Promise<void>,
	fetchStorymaps: (searchText: string, myItems: boolean) => Promise<void>,
) => {
	const newIsMyItems = !isMyItems;
	setIsMyItems(newIsMyItems);
	const searchText = watch("searchText") || "";
	if (type === "map") {
		fetchMaps(searchText, newIsMyItems);
	}
	if (type === "storymap") {
		fetchStorymaps(searchText, newIsMyItems);
	}
};

export {
	handleSearchInManagementTable,
	handleResetInManagementTable,
	handleGetMyItemsInManagementTable,
};
