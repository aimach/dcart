// import des bibliothèques
import { createContext, useEffect, useState } from "react";
// import des types
import type { ReactNode } from "react";
import type { MapColorType, MapIconType } from "../utils/types/mapTypes";
// import des services
import { getAllColors, getAllIcons } from "../utils/api/builtMap/getRequests";

type IconOptionsContextType = {
	icons: MapIconType[];
	colors: MapColorType[];
}


export const IconOptionsContext = createContext<IconOptionsContextType>({
	icons: [],
	colors: [],
});

interface IconOptionsProviderProps {
	children: ReactNode;
}

export const IconOptionsProvider = ({ children }: IconOptionsProviderProps) => {
	const [icons, setIcons] = useState<MapIconType[]>([]);
	const [colors, setColors] = useState<MapColorType[]>([]);

	useEffect(() => {
		const fetchAllIcons = async () => {
			const fetchedIcons = await getAllIcons();
			setIcons(fetchedIcons);
		};
		const fetchAllColors = async () => {
			const fetchedColors = await getAllColors();
			setColors(fetchedColors);
		}
		fetchAllIcons();
		fetchAllColors();
	}, []);

	return (
		<IconOptionsContext.Provider value={{ icons, colors }}>
			{children}
		</IconOptionsContext.Provider>
	);
};
