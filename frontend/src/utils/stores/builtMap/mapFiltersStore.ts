// import des bibliothèques
import { create } from "zustand";
// import des types
import type { UserFilterType } from "../../types/filterTypes";

type State = {
	userFilters: UserFilterType;
	isReset: boolean;
	locationNames: string[];
	elementNames: string[];
	sourceTypeNames: string[];
	agentActivityNames: string[];
	languageValues: Record<string, boolean>;
};

type Action = {
	setUserFilters: (filters: UserFilterType) => void;
	resetUserFilters: () => void;
	setIsReset: (isReset: boolean) => void;
	setLocationNames: (locationNames: string[]) => void;
	setElementNames: (elementNames: string[]) => void;
	setSourceTypeNames: (locationNames: string[]) => void;
	setAgentActivityNames: (agentActivityNames: string[]) => void;
	setLanguageValues: (languageValues: Record<string, boolean>) => void;
	resetLanguageValues: () => void;
};

const emptyUserFilters: UserFilterType = {
	post: undefined,
	ante: undefined,
	elementId: undefined,
	lotIds: [],
	locationId: undefined,
	greek: false,
	semitic: false,
	minDivinityNb: undefined,
	maxDivinityNb: undefined,
	sourceTypeId: undefined,
	agentActivityId: undefined,
	agentNameId: undefined,
};

export const useMapFiltersStore = create<State & Action>((set, get) => ({
	userFilters: emptyUserFilters,
	setUserFilters: (userFilters) => set(() => ({ userFilters })),
	resetUserFilters: () => {
		set(() => ({ userFilters: emptyUserFilters }));
		get().setElementNames([]);
		get().setLocationNames([]);
		get().setSourceTypeNames([]);
	},
	isReset: false,
	setIsReset: (isReset) => set(() => ({ isReset: isReset })),
	locationNames: [],
	setLocationNames: (locationNames) => set(() => ({ locationNames })),
	elementNames: [],
	setElementNames: (elementNames) => set(() => ({ elementNames })),
	sourceTypeNames: [],
	setSourceTypeNames: (sourceTypeNames) => set(() => ({ sourceTypeNames })),
	agentActivityNames: [],
	setAgentActivityNames: (agentActivityNames) =>
		set(() => ({ agentActivityNames })),
	languageValues: { greek: false, semitic: false },
	setLanguageValues: (languageValues) => set(() => ({ languageValues })),
	resetLanguageValues: () =>
		set(() => ({ languageValues: { greek: false, semitic: false } })),
}));
