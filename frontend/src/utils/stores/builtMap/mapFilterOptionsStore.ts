// import des bibliothèques
import { create } from "zustand";
// import des types
import type { OptionType } from "../../types/commonTypes";

type State = {
	hasFilteredPoints: boolean;
	// initial state
	initialLocationOptions: OptionType[];
	initialElementOptions: OptionType[];
	initialElementNbOptions: { min: number; max: number } | null;
	initialAgentActivityOptions: OptionType[];
	initialAgentStatusOptions: OptionType[];
	initialAgentivityOptions: OptionType[];
	initialAgentGenderOptions: string[];
	initialSourceMaterialOptions: OptionType[];
	initialSourceTypeOptions: OptionType[];
	initialSourceLanguageOptions: { greek: boolean; semitic: boolean };
	// filtered state
	filteredLocationOptions: OptionType[];
	filteredElementOptions: OptionType[];
	filteredElementNbOptions: { min: number; max: number } | null;
	filteredAgentActivityOptions: OptionType[];
	filteredAgentStatusOptions: OptionType[];
	filteredAgentivityOptions: OptionType[];
	filteredAgentGenderOptions: string[];
	filteredSourceMaterialOptions: OptionType[];
	filteredSourceTypeOptions: OptionType[];
	filteredSourceLanguageOptions: { greek: boolean; semitic: boolean };
};

type Action = {
	setHasFilteredPoints: (hasFiltered: boolean) => void;
	// initial state setters
	setInitialLocationOptions: (options: OptionType[]) => void;
	setInitialElementOptions: (options: OptionType[]) => void;
	setInitialElementNbOptions: (options: { min: number; max: number }) => void;
	setInitialAgentActivityOptions: (options: OptionType[]) => void;
	setInitialAgentStatusOptions: (options: OptionType[]) => void;
	setInitialAgentivityOptions: (options: OptionType[]) => void;
	setInitialAgentGenderOptions: (options: string[]) => void;
	setInitialSourceMaterialOptions: (options: OptionType[]) => void;
	setInitialSourceTypeOptions: (options: OptionType[]) => void;
	setInitialSourceLanguageOptions: (options: {
		greek: boolean;
		semitic: boolean;
	}) => void;
	// filtered state setters
	setFilteredLocationOptions: (options: OptionType[]) => void;
	setFilteredElementOptions: (options: OptionType[]) => void;
	setFilteredElementNbOptions: (options: { min: number; max: number }) => void;
	setFilteredAgentActivityOptions: (options: OptionType[]) => void;
	setFilteredAgentStatusOptions: (options: OptionType[]) => void;
	setFilteredAgentivityOptions: (options: OptionType[]) => void;
	setFilteredAgentGenderOptions: (options: string[]) => void;
	setFilteredSourceMaterialOptions: (options: OptionType[]) => void;
	setFilteredSourceTypeOptions: (options: OptionType[]) => void;
	setFilteredSourceLanguageOptions: (options: {
		greek: boolean;
		semitic: boolean;
	}) => void;
	// resetters
	resetFilteredOptions: () => void;
	resetInitialOptions: () => void;
};

export const useMapFilterOptionsStore = create<State & Action>((set) => ({
	hasFilteredPoints: false,
	setHasFilteredPoints: (hasFilteredPoints) =>
		set({ hasFilteredPoints: hasFilteredPoints }),

	initialLocationOptions: [],
	initialElementOptions: [],
	initialElementNbOptions: null,
	initialAgentActivityOptions: [],
	initialAgentStatusOptions: [],
	initialAgentivityOptions: [],
	initialAgentGenderOptions: [],
	initialSourceMaterialOptions: [],
	initialSourceTypeOptions: [],
	initialSourceLanguageOptions: { greek: false, semitic: false },
	filteredLocationOptions: [],
	filteredElementOptions: [],
	filteredElementNbOptions: null,
	filteredAgentActivityOptions: [],
	filteredAgentStatusOptions: [],
	filteredAgentivityOptions: [],
	filteredAgentGenderOptions: [],
	filteredSourceMaterialOptions: [],
	filteredSourceTypeOptions: [],
	filteredSourceLanguageOptions: { greek: false, semitic: false },

	setInitialLocationOptions: (options) =>
		set({ initialLocationOptions: options }),
	setInitialElementOptions: (options) =>
		set({ initialElementOptions: options }),
	setInitialElementNbOptions: (options) =>
		set({ initialElementNbOptions: options }),
	setInitialAgentActivityOptions: (options) =>
		set({ initialAgentActivityOptions: options }),
	setInitialAgentStatusOptions: (options) =>
		set({ initialAgentStatusOptions: options }),
	setInitialAgentivityOptions: (options) =>
		set({ initialAgentivityOptions: options }),
	setInitialAgentGenderOptions: (options) =>
		set({ initialAgentGenderOptions: options }),
	setInitialSourceMaterialOptions: (options) =>
		set({ initialSourceMaterialOptions: options }),
	setInitialSourceTypeOptions: (options) =>
		set({ initialSourceTypeOptions: options }),
	setInitialSourceLanguageOptions: (options) =>
		set({ initialSourceLanguageOptions: options }),

	setFilteredLocationOptions: (options) =>
		set({ filteredLocationOptions: options }),
	setFilteredElementOptions: (options) =>
		set({ filteredElementOptions: options }),
	setFilteredElementNbOptions: (options) =>
		set({ filteredElementNbOptions: options }),
	setFilteredAgentActivityOptions: (options) =>
		set({ filteredAgentActivityOptions: options }),
	setFilteredAgentStatusOptions: (options) =>
		set({ filteredAgentStatusOptions: options }),
	setFilteredAgentivityOptions: (options) =>
		set({ filteredAgentivityOptions: options }),
	setFilteredAgentGenderOptions: (options) =>
		set({ filteredAgentGenderOptions: options }),
	setFilteredSourceMaterialOptions: (options) =>
		set({ filteredSourceMaterialOptions: options }),
	setFilteredSourceTypeOptions: (options) =>
		set({ filteredSourceTypeOptions: options }),
	setFilteredSourceLanguageOptions: (options) =>
		set({ filteredSourceLanguageOptions: options }),

	resetFilteredOptions: () =>
		set((state) => ({
			filteredLocationOptions: state.initialLocationOptions,
			filteredElementOptions: state.initialElementOptions,
			filteredElementNbOptions: state.initialElementNbOptions,
			filteredAgentActivityOptions: state.initialAgentActivityOptions,
			filteredAgentStatusOptions: state.initialAgentStatusOptions,
			filteredAgentivityOptions: state.initialAgentivityOptions,
			filteredAgentGenderOptions: state.initialAgentGenderOptions,
			filteredSourceMaterialOptions: state.initialSourceMaterialOptions,
			filteredSourceTypeOptions: state.initialSourceTypeOptions,
			filteredSourceLanguageOptions: state.initialSourceLanguageOptions,
			hasFilteredPoints: false,
		})),
	resetInitialOptions: () =>
		set(() => ({
			initialLocationOptions: [],
			initialElementOptions: [],
			initialElementNbOptions: null,
			initialAgentActivityOptions: [],
			initialAgentStatusOptions: [],
			initialAgentivityOptions: [],
			initialAgentGenderOptions: [],
			initialSourceMaterialOptions: [],
			initialSourceTypeOptions: [],
			initialSourceLanguageOptions: { greek: false, semitic: false },
			filteredLocationOptions: [],
			filteredElementOptions: [],
			filteredElementNbOptions: null,
			filteredAgentActivityOptions: [],
			filteredAgentStatusOptions: [],
			filteredAgentivityOptions: [],
			filteredAgentGenderOptions: [],
			filteredSourceMaterialOptions: [],
			filteredSourceTypeOptions: [],
			filteredSourceLanguageOptions: { greek: false, semitic: false },
			hasFilteredPoints: false,
		})),
}));
