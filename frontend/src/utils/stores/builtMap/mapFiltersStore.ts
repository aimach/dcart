// import des bibliothèques
import { create } from "zustand";
// import des types
import type { UserFilterType } from "../../types/filterTypes";
import type { SelectedObjectType } from "../../../components/builtMap/aside/filterComponents/ElementCheckboxComponent";

type State = {
	userFilters: UserFilterType;
	isReset: boolean;
	locationNames: string[];
	elementNames: string[];
	sourceTypeNames: string[];
	agentActivityNames: string[];
	agentStatusNames: string[];
	agentivityNames: string[];
	sourceMaterialNames: string[];
	languageValues: Record<string, boolean>;
	genderValues: Record<string, boolean>;
	elementCheckboxSelected: SelectedObjectType;
};

type Action = {
	setUserFilters: (filters: UserFilterType) => void;
	resetUserFilters: () => void;
	setIsReset: (isReset: boolean) => void;
	setLocationNames: (locationNames: string[]) => void;
	setElementNames: (elementNames: string[]) => void;
	setSourceTypeNames: (locationNames: string[]) => void;
	setAgentActivityNames: (agentActivityNames: string[]) => void;
	setAgentStatusNames: (agentStatusNames: string[]) => void;
	setAgentivityNames: (agentivityNames: string[]) => void;
	setSourceMaterialNames: (sourceMaterialName: string[]) => void;
	setLanguageValues: (languageValues: Record<string, boolean>) => void;
	setGenderValues: (genderValues: Record<string, boolean>) => void;
	setElementCheckboxSelected: (selected: SelectedObjectType) => void;
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
	agentGender: { male: false, female: false, nonBinary: false },
	agentStatusName: undefined,
	agentivityName: undefined,
	sourceMaterialName: undefined,
};

export const useMapFiltersStore = create<State & Action>((set, get) => ({
	userFilters: emptyUserFilters,
	setUserFilters: (userFilters) => set(() => ({ userFilters })),
	resetUserFilters: () => {
		set(() => ({ userFilters: emptyUserFilters }));
		get().setElementNames([]);
		get().setLocationNames([]);
		get().setSourceTypeNames([]);
		get().setAgentActivityNames([]);
		get().setAgentStatusNames([]);
		get().setAgentivityNames([]);
		get().setSourceMaterialNames([]);
		get().setLanguageValues({ greek: false, semitic: false });
		get().setGenderValues({ male: false, female: false, nonBinary: false });
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
	agentStatusNames: [],
	setAgentStatusNames: (agentStatusNames) => set(() => ({ agentStatusNames })),
	agentivityNames: [],
	setAgentivityNames: (agentivityNames) => set(() => ({ agentivityNames })),
	sourceMaterialNames: [],
	setSourceMaterialNames: (sourceMaterialNames) =>
		set(() => ({ sourceMaterialNames })),
	languageValues: { greek: false, semitic: false },
	setLanguageValues: (languageValues) => set(() => ({ languageValues })),
	resetLanguageValues: () =>
		set(() => ({ languageValues: { greek: false, semitic: false } })),
	genderValues: { male: false, female: false, nonBinary: false },
	setGenderValues: (genderValues) => set(() => ({ genderValues })),
	elementCheckboxSelected: {},
	setElementCheckboxSelected: (selected) =>
		set(() => ({ elementCheckboxSelected: selected })),
}));
