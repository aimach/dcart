// import des bibliothèques
import { create } from "zustand";
// import des types
import type { MenuTabType } from "../types/mapTypes";

type State = {
	selectedTabMenu: MenuTabType;
};

type Action = {
	setSelectedTabMenu: (selectedTabMenu: MenuTabType) => void;
};

export const useMapAsideMenuStore = create<State & Action>((set) => ({
	selectedTabMenu: "results",
	setSelectedTabMenu: (selectedTabMenu) => set(() => ({ selectedTabMenu })),
}));
