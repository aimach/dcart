// import des bibliothèques
import { create } from "zustand";
// import des types
import type { Map as LeafletMap } from "leaflet";
import type { MapInfoType, PointType } from "../types/mapTypes";

type State = {
	map: LeafletMap | null;
	mapInfos: MapInfoType | null;
	allPoints: PointType[];
	mapReady: boolean;
};

type Action = {
	setMap: (map: LeafletMap | null) => void;
	setMapInfos: (mapInfo: MapInfoType | null) => void;
	setAllPoints: (allPoints: PointType[]) => void;
	setMapReady: (mapReady: boolean) => void;
};

export const useMapFormStore = create<State & Action>((set) => ({
	map: null,
	setMap: (map) => set(() => ({ map })),
	mapInfos: null,
	setMapInfos: (mapInfos) => set(() => ({ mapInfos })),
	allPoints: [],
	setAllPoints: (allPoints) => set(() => ({ allPoints })),
	mapReady: false,
	setMapReady: (mapReady) => set(() => ({ mapReady })),
}));
