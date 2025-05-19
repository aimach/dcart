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
	lotIds: number[][];
	locationType?: string;
	locationId?: string;
	sourceTypeId?: string;
	greek: boolean;
	semitic: boolean;
	minDivinityNb?: string;
	maxDivinityNb?: string;
	agentActivityId?: string;
	agentNameId?: string;
	agentGender?: { male?: boolean; female?: boolean; nonBinary?: boolean };
	agentStatusName?: string;
};

type LotType = {
	firstLevelIds: OptionType[];
	secondLevelIds: OptionType[];
};

export type { FilterType, UserFilterType, LotType };
