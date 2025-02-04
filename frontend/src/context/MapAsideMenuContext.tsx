// import des bibliothèques
import { createContext, useState } from "react";
// import des types
import type { ReactNode } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { MenuTabType } from "../utils/types/mapTypes";

export type MapAsideMenuContextType = {
	selectedTabMenu: MenuTabType;
	setSelectedTabMenu: Dispatch<SetStateAction<MenuTabType>>;
};

export const MapAsideMenuContext = createContext<MapAsideMenuContextType>({
	selectedTabMenu: "results",
	setSelectedTabMenu: () => {},
});

interface MapAsideMenuProviderProps {
	children: ReactNode;
}

export const MapAsideMenuProvider = ({
	children,
}: MapAsideMenuProviderProps) => {
	const [selectedTabMenu, setSelectedTabMenu] =
		useState<MenuTabType>("results");

	return (
		<MapAsideMenuContext.Provider
			value={{ selectedTabMenu, setSelectedTabMenu }}
		>
			{children}
		</MapAsideMenuContext.Provider>
	);
};
