// import des bibliothèques
import { create } from "zustand";
// import des types
import type { MenuTabType } from "../../types/mapTypes";
import type { FilterType } from "../../types/filterTypes";

type State = {
	selectedTabMenu: MenuTabType;
	mapFilters: FilterType[];
};

type Action = {
	setSelectedTabMenu: (selectedTabMenu: MenuTabType) => void;
	setMapFilters: (mapFilters: FilterType[]) => void;
	resetFilters: () => void;
};

export const useMapAsideMenuStore = create<State & Action>((set) => ({
	// gestion de l'onglet en cours
	selectedTabMenu: "results",
	setSelectedTabMenu: (selectedTabMenu) => set(() => ({ selectedTabMenu })),
	// gestion des filtres
	mapFilters: [],
	setMapFilters: (mapFilters) => set(() => ({ mapFilters })),
	resetFilters: () => set(() => ({ mapFilters: [] })),
}));
