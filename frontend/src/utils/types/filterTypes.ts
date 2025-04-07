type FilterType = {
	id: string;
	type: "time" | "language" | "element" | "location" | "divinityNb";
};

type UserFilterType = {
	ante?: number;
	post?: number;
	elementId?: string;
	locationType?: string;
	locationId?: string;
	greek: boolean;
	semitic: boolean;
	divinityNb?: { min: string; max: string };
};

export type { FilterType, UserFilterType };
