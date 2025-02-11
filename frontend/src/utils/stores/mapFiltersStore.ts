// import des bibliothèques
import { create } from "zustand";
// import des types
import type { UserFilterType } from "../types/filterTypes";

type State = {
	userFilters: UserFilterType;
};

type Action = {
	setUserFilters: (filters: UserFilterType) => void;
};

export const useMapFiltersStore = create<State & Action>((set) => ({
	userFilters: {
		post: undefined,
		ante: undefined,
		element: undefined,
		locationType: undefined,
		locationId: undefined,
	},
	setUserFilters: (userFilters) => set(() => ({ userFilters })),
}));
