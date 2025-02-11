type FilterType = {
	id: string;
	type: "time" | "language" | "element" | "location";
};

type UserFilterType = {
	ante_quem?: number;
	post_quem?: number;
	element?: string;
	location?: string;
};

export type { FilterType, UserFilterType };
