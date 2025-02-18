// import des bibliothèques
import { create } from "zustand";
// import des types
import type { Map as LeafletMap } from "leaflet";
import type { MapInfoType, PointType } from "../types/mapTypes";

type State = {
	map: LeafletMap | null;
	mapInfos: MapInfoType | null;
	allPoints: PointType[];
	selectedMarker: PointType | undefined;
	includedElementId: string | undefined;
	mapReady: boolean;
	tileLayerURL: string;
};

type Action = {
	setMap: (map: LeafletMap | null) => void;
	setMapInfos: (mapInfo: MapInfoType | null) => void;
	setAllPoints: (allPoints: PointType[]) => void;
	setSelectedMarker: (selectedMarker: PointType | undefined) => void;
	resetSelectedMarker: () => void;
	setIncludedElementId: (includedElementId: string | undefined) => void;
	setMapReady: (mapReady: boolean) => void;
	setTileLayerURL: (tileLayerURL: string) => void;
	resetTileLayerURL: () => void;
};

export const useMapStore = create<State & Action>((set) => ({
	map: null,
	setMap: (map) => set(() => ({ map })),
	mapInfos: null,
	setMapInfos: (mapInfos) => set(() => ({ mapInfos })),
	allPoints: [],
	setAllPoints: (allPoints) => set(() => ({ allPoints })),
	selectedMarker: undefined,
	setSelectedMarker: (selectedMarker) => set(() => ({ selectedMarker })),
	resetSelectedMarker: () => set(() => ({ selectedMarker: undefined })),
	includedElementId: undefined,
	setIncludedElementId: (includedElementId) =>
		set(() => ({ includedElementId })),
	mapReady: false,
	setMapReady: (mapReady) => set(() => ({ mapReady })),
	tileLayerURL:
		"https://cawm.lib.uiowa.edu/tiles/%7Bz%7D/%7Bx%7D/%7By%7D.png/tiles/{z}/{x}/{y}.png",
	setTileLayerURL: (tileLayerURL) => set(() => ({ tileLayerURL })),
	resetTileLayerURL: () =>
		set(() => ({
			tileLayerURL:
				"https://cawm.lib.uiowa.edu/tiles/%7Bz%7D/%7Bx%7D/%7By%7D.png/tiles/{z}/{x}/{y}.png",
		})),
}));
