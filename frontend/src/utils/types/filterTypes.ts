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

export type { FilterType, UserFilterType };
