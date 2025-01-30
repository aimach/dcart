// import des bibliothèques
import { createContext, useEffect, useState } from "react";
// import des types
import type { ReactNode, Dispatch, SetStateAction } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { PointType } from "../types/mapTypes";
import { useNavigate } from "react-router";

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
	const navigate = useNavigate();

	// biome-ignore lint/correctness/useExhaustiveDependencies: il est nécessaire de reset le marker entre chaque carte
	useEffect(() => {
		setSelectedMarker(undefined);
	}, [navigate]);

	return (
		<MapContext.Provider
			value={{ selectedMarker, setSelectedMarker, map, setMap }}
		>
			{children}
		</MapContext.Provider>
	);
};
