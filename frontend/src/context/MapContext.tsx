// import des bibliothèques
import { createContext, useState } from "react";
// import des types
import type { ReactNode, Dispatch, SetStateAction } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { PointType } from "../types/mapTypes";

export type MapContextType = {
	map: LeafletMap | null;
	setMap: Dispatch<SetStateAction<LeafletMap | null>>;
	selectedMarker: PointType | undefined;
	setSelectedMarker: Dispatch<SetStateAction<PointType | undefined>>;
};

export const MapContext = createContext<MapContextType>({
	map: null,
	setMap: () => {},
	selectedMarker: undefined,
	setSelectedMarker: () => {},
});

interface MapProviderProps {
	children: ReactNode;
}

export const MapProvider = ({ children }: MapProviderProps) => {
	const [selectedMarker, setSelectedMarker] = useState<PointType | undefined>(
		undefined,
	);
	const [map, setMap] = useState<LeafletMap | null>(null);

	return (
		<MapContext.Provider
			value={{ selectedMarker, setSelectedMarker, map, setMap }}
		>
			{children}
		</MapContext.Provider>
	);
};
