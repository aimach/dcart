// import des bibliothèques
import { create } from "zustand";
// import des types
import type { UserFilterType } from "../../types/filterTypes";

type State = {
	userFilters: UserFilterType;
	isReset: boolean;
};

type Action = {
	setUserFilters: (filters: UserFilterType) => void;
	resetUserFilters: () => void;
	setIsReset: (isReset: boolean) => void;
};

const emptyUserFilters: UserFilterType = {
	post: undefined,
	ante: undefined,
	elementId: undefined,
	locationId: undefined,
	greek: false,
	semitic: false,
};

export const useMapFiltersStore = create<State & Action>((set) => ({
	userFilters: emptyUserFilters,
	setUserFilters: (userFilters) => set(() => ({ userFilters })),
	resetUserFilters: () => set(() => ({ userFilters: emptyUserFilters })),
	isReset: false,
	setIsReset: (isReset) => set(() => ({ isReset: isReset })),
}));
