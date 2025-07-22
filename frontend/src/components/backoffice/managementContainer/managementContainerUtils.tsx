// import des types
import type { UseFormResetField, UseFormWatch } from "react-hook-form";
import type { SortConfigType } from "./ManagementContainer";
import type { MapType } from "../../../utils/types/mapTypes";
import type { StorymapType } from "../../../utils/types/storymapTypes";
import type { Dispatch, SetStateAction } from "react";
import {
	ArrowDownNarrowWide,
	ArrowDownUp,
	ArrowUpNarrowWide,
} from "lucide-react";

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

const handleSort = (
	key: string,
	itemsArray: SetStateAction<MapType[]> | SetStateAction<StorymapType[]>,
	setItemsArray:
		| Dispatch<SetStateAction<MapType[]>>
		| Dispatch<SetStateAction<StorymapType[]>>,
	sortConfig: SortConfigType,
	setSortConfig: (config: SortConfigType) => void,
) => {
	let direction: "asc" | "desc" = "asc";
	if (sortConfig.key === key && sortConfig.direction === "asc") {
		direction = "desc";
	}

	const sorted = [...itemsArray].sort((a, b) => {
		const getValue = (obj, keyPath: string) => {
			if (keyPath.includes(".")) {
				return keyPath.split(".").reduce((acc, k) => acc?.[k], obj);
			}
			return obj?.[keyPath];
		};

		const aValue = getValue(a, key);
		const bValue = getValue(b, key);
		const aIsNull = aValue === null || aValue === undefined;
		const bIsNull = bValue === null || bValue === undefined;

		if (aIsNull && bIsNull) return 0;
		if (aIsNull) return 1; // a va en bas
		if (bIsNull) return -1; // b va en bas

		if (aValue < bValue) return direction === "asc" ? -1 : 1;
		if (aValue > bValue) return direction === "asc" ? 1 : -1;
		return 0;
	});

	setSortConfig({ key, direction });
	setItemsArray(sorted);
};

const getArrow = (key: string, sortConfig: SortConfigType) => {
	const color = "#AD9A85";
	const size = 20;
	if (sortConfig.key !== key) return <ArrowDownUp color={color} size={size} />;
	return sortConfig.direction === "asc" ? (
		<ArrowUpNarrowWide color={color} size={size} />
	) : (
		<ArrowDownNarrowWide color={color} size={size} />
	);
};

export {
	handleSearchInManagementTable,
	handleResetInManagementTable,
	handleGetMyItemsInManagementTable,
	handleSort,
	getArrow,
};
