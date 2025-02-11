type FilterType = {
	id: string;
	type: "time" | "language" | "element" | "location";
};

type UserFilterType = {
	ante?: number;
	post?: number;
	element?: string;
	location?: string;
};

export type { FilterType, UserFilterType };
