type FilterType = {
	id: string;
	type: "time" | "language" | "element" | "location";
};

type UserFilterType = {
	ante?: number;
	post?: number;
	elementId?: string;
	locationType?: string;
	locationId?: string;
	greek: boolean;
	semitic: boolean;
};

export type { FilterType, UserFilterType };
