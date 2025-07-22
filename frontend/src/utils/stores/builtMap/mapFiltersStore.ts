// import des bibliothèques
import { create } from "zustand";
// import des types
import type { UserFilterType } from "../../types/filterTypes";
import type { SelectedObjectType } from "../../../components/builtMap/aside/filterComponents/ElementCheckboxComponent";

type State = {
	userFilters: UserFilterType;
	isReset: boolean;
	elementCheckboxSelected: SelectedObjectType;
};

type Action = {
	setUserFilters: (filters: UserFilterType) => void;
	resetUserFilters: () => void;
	setIsReset: (isReset: boolean) => void;
	setElementCheckboxSelected: (selected: SelectedObjectType) => void;
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
	},
	isReset: false,
	setIsReset: (isReset) => set(() => ({ isReset: isReset })),
	elementCheckboxSelected: {},
	setElementCheckboxSelected: (selected) =>
		set(() => ({ elementCheckboxSelected: selected })),
}));
