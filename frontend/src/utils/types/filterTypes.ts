// import des types
import type { OptionType } from "./commonTypes";

type FilterType = {
	id: string;
	type: "time" | "language" | "element" | "location" | "divinityNb";
};

type UserFilterType = {
	ante?: number;
	post?: number;
	elementId?: string;
	lotIds: string[][];
	locationType?: string;
	locationId?: string;
	greek: boolean;
	semitic: boolean;
	minDivinityNb?: string;
	maxDivinityNb?: string;
};

type LotType = {
	firstLevelIds: OptionType[];
	secondLevelIds: OptionType[];
};

export type { FilterType, UserFilterType, LotType };
