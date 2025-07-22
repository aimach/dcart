// import des bibliothèques
import { create } from "zustand";
// import des types
import type { MenuTabType } from "../../types/mapTypes";

type State = {
	selectedTabMenu: MenuTabType;
	mapFilters: {
		id: number;
		options: Record<string, string>;
		filter: { type: string };
	}[];
	isPanelDisplayed: boolean;
};

type Action = {
	setSelectedTabMenu: (selectedTabMenu: MenuTabType) => void;
	setMapFilters: (
		mapFilters: {
			id: number;
			options: Record<string, string>;
			filter: { type: string };
		}[],
	) => void;
	resetFilters: () => void;
	setIsPanelDisplayed: (isPanelDisplayed: boolean) => void;
};

export const useMapAsideMenuStore = create<State & Action>((set) => ({
	// gestion de l'onglet en cours
	selectedTabMenu: "results",
	setSelectedTabMenu: (selectedTabMenu) => set(() => ({ selectedTabMenu })),
	// gestion des filtres
	mapFilters: [],
	setMapFilters: (mapFilters) => set(() => ({ mapFilters })),
	resetFilters: () => set(() => ({ mapFilters: [] })),
	isPanelDisplayed: false,
	setIsPanelDisplayed: (isPanelDisplayed) =>
		set(() => ({ isPanelDisplayed: isPanelDisplayed })),
}));
