// import des bibliothèques
import { create } from "zustand";
// import des types
import type { Map as LeafletMap } from "leaflet";
import type { MapInfoType, PointType } from "../types/mapTypes";

type State = {
	step: number;
	map: LeafletMap | null;
	mapInfos: MapInfoType | null;
	allPoints: PointType[];
	mapReady: boolean;
};

type Action = {
	setStep: (step: number) => void;
	setMap: (map: LeafletMap | null) => void;
	setMapInfos: (mapInfo: MapInfoType | null) => void;
	setAllPoints: (allPoints: PointType[]) => void;
	setMapReady: (mapReady: boolean) => void;
};

export const useMapFormStore = create<State & Action>((set) => ({
	step: 1,
	setStep: (step) => set(() => ({ step: step + 1 })),
	map: null,
	setMap: (map) => set(() => ({ map })),
	mapInfos: null,
	setMapInfos: (mapInfos) => set(() => ({ mapInfos })),
	allPoints: [],
	setAllPoints: (allPoints) => set(() => ({ allPoints })),
	mapReady: false,
	setMapReady: (mapReady) => set(() => ({ mapReady })),
}));
