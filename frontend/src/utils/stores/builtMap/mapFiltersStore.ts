// import des bibliothèques
import { create } from "zustand";
// import des types
import type { UserFilterType } from "../../types/filterTypes";

type State = {
	userFilters: UserFilterType;
	isReset: boolean;
	locationNames: string[];
	elementNames: string[];
};

type Action = {
	setUserFilters: (filters: UserFilterType) => void;
	resetUserFilters: () => void;
	setIsReset: (isReset: boolean) => void;
	setLocationNames: (locationNames: string[]) => void;
	setElementNames: (elementNames: string[]) => void;
};

const emptyUserFilters: UserFilterType = {
	post: undefined,
	ante: undefined,
	elementId: undefined,
	locationId: undefined,
	greek: false,
	semitic: false,
};

export const useMapFiltersStore = create<State & Action>((set, get) => ({
	userFilters: emptyUserFilters,
	setUserFilters: (userFilters) => set(() => ({ userFilters })),
	resetUserFilters: () => {
		set(() => ({ userFilters: emptyUserFilters }));
		get().setElementNames([]);
		get().setLocationNames([]);
	},
	isReset: false,
	setIsReset: (isReset) => set(() => ({ isReset: isReset })),
	locationNames: [],
	setLocationNames: (locationNames) => set(() => ({ locationNames })),
	elementNames: [],
	setElementNames: (elementNames) => set(() => ({ elementNames })),
}));
