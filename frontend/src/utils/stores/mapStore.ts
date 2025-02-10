// import des bibliothèques
import { create } from "zustand";
// import des types
import type { Map as LeafletMap } from "leaflet";
import type { PointType } from "../types/mapTypes";

type State = {
	map: LeafletMap | null;
	selectedMarker: PointType | undefined;
	includedElementId: string | undefined;
};

type Action = {
	setMap: (map: LeafletMap | null) => void;
	setSelectedMarker: (selectedMarker: PointType | undefined) => void;
	resetSelectedMarker: () => void;
	setIncludedElementId: (includedElementId: string | undefined) => void;
};

export const useMapStore = create<State & Action>((set) => ({
	map: null,
	setMap: (map) => set(() => ({ map })),
	selectedMarker: undefined,
	setSelectedMarker: (selectedMarker) => set(() => ({ selectedMarker })),
	resetSelectedMarker: () => set(() => ({ selectedMarker: undefined })),
	includedElementId: undefined,
	setIncludedElementId: (includedElementId) =>
		set(() => ({ includedElementId })),
}));
