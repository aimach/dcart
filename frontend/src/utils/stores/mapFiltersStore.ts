// import des bibliothèques
import { create } from "zustand";
// import des types
import type { UserFilterType } from "../types/filterTypes";

type State = {
	userFilters: UserFilterType;
};

type Action = {
	setUserFilters: (filters: UserFilterType) => void;
	resetUserFilters: () => void;
};

const emptyUserFilters: UserFilterType = {
	post: undefined,
	ante: undefined,
	elementId: undefined,
	locationType: undefined,
	locationId: undefined,
	greek: true,
	semitic: true,
};

export const useMapFiltersStore = create<State & Action>((set) => ({
	userFilters: emptyUserFilters,
	setUserFilters: (userFilters) => set(() => ({ userFilters })),
	resetUserFilters: () => set(() => ({ userFilters: emptyUserFilters })),
}));
