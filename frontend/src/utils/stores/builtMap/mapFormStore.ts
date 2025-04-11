// import des bibliothèques
import { create } from "zustand";
// import des types
import type { Map as LeafletMap } from "leaflet";
import type {
	MapFilterType,
	MapInfoType,
	PointType,
} from "../../types/mapTypes";

type State = {
	step: number;
	map: LeafletMap | null;
	mapInfos: MapInfoType | null;
	mapFilters: MapFilterType;
	mapFiltersOptions: Record<string, string>;
	allPoints: PointType[];
	mapReady: boolean;
};

type Action = {
	setStep: (step: number) => void;
	incrementStep: (step: number) => void;
	decrementStep: (step: number) => void;
	setMap: (map: LeafletMap | null) => void;
	setMapInfos: (mapInfo: MapInfoType | null) => void;
	setMapFilters: (mapFilter: MapFilterType) => void;
	resetMapFilters: () => void;
	setMapFiltersOptions: (mapFiltersOptions: Record<string, string>) => void;
	resetMapInfos: () => void;
	setAllPoints: (allPoints: PointType[]) => void;
	resetAllPoints: () => void;
	setMapReady: (mapReady: boolean) => void;
};

export const useMapFormStore = create<State & Action>((set) => ({
	step: 1,
	setStep: (step) => set(() => ({ step })),
	incrementStep: (step) => set(() => ({ step: step + 1 })),
	decrementStep: (step) => set(() => ({ step: step - 1 })),
	map: null,
	setMap: (map) => set(() => ({ map })),
	mapInfos: null,
	mapFilters: {
		location: false,
		language: false,
		element: false,
		divinityNb: false,
	},
	setMapFilters: (mapFilters) => set(() => ({ mapFilters })),
	resetMapFilters: () =>
		set(() => ({
			mapFilters: {
				location: false,
				language: false,
				element: false,
				divinityNb: false,
			},
		})),
	setMapInfos: (mapInfos) => set(() => ({ mapInfos })),
	resetMapInfos: () => set(() => ({ mapInfos: null })),
	allPoints: [],
	setAllPoints: (allPoints) => set(() => ({ allPoints })),
	resetAllPoints: () => set(() => ({ allPoints: [] })),
	mapReady: false,
	setMapReady: (mapReady) => set(() => ({ mapReady })),
	mapFiltersOptions: { element: "basic" },
	setMapFiltersOptions: (mapFiltersOptions) =>
		set(() => ({ mapFiltersOptions: mapFiltersOptions })),
}));
