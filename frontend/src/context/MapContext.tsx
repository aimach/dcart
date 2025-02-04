// import des bibliothèques
import { createContext, useEffect, useState } from "react";
// import des types
import type { ReactNode, Dispatch, SetStateAction } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { PointType } from "../utils/types/mapTypes";
import { useNavigate } from "react-router";

export type MapContextType = {
	map: LeafletMap | null;
	setMap: Dispatch<SetStateAction<LeafletMap | null>>;
	selectedMarker: PointType | undefined;
	setSelectedMarker: Dispatch<SetStateAction<PointType | undefined>>;
	includedElementId: string | undefined;
	setIncludedElementId: Dispatch<SetStateAction<string | undefined>>;
};

export const MapContext = createContext<MapContextType>({
	map: null,
	setMap: () => {},
	selectedMarker: undefined,
	setSelectedMarker: () => {},
	includedElementId: undefined,
	setIncludedElementId: () => {},
});

interface MapProviderProps {
	children: ReactNode;
}

export const MapProvider = ({ children }: MapProviderProps) => {
	// on stocke dans ce state la carte en cours
	const [map, setMap] = useState<LeafletMap | null>(null);
	// on stocke dans ce state l'includedElement de la carte
	const [includedElementId, setIncludedElementId] = useState<
		string | undefined
	>(undefined);

	// on stocke dans ce state le point sélectionné
	const [selectedMarker, setSelectedMarker] = useState<PointType | undefined>(
		undefined,
	);
	const navigate = useNavigate();

	// biome-ignore lint/correctness/useExhaustiveDependencies: il est nécessaire de reset le marker entre chaque carte
	useEffect(() => {
		setSelectedMarker(undefined);
	}, [navigate]);

	return (
		<MapContext.Provider
			value={{
				selectedMarker,
				setSelectedMarker,
				map,
				setMap,
				includedElementId,
				setIncludedElementId,
			}}
		>
			{children}
		</MapContext.Provider>
	);
};
