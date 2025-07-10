// import des bibliothèques
import { create } from "zustand";

type State = {
	// stockage temporaire des reminders
	locationNameValues: string[];
	elementNameValues: string[];
	elementNbValues: {
		min: number;
		max: number;
	} | null;
	sourceTypeValues: string[];
	agentActivityValues: string[];
	agentStatusValues: string[];
	agentivityValues: string[];
	sourceMaterialValues: string[];

	// reminders pour le titre de la carte
	locationFilterReminders: string[];
	elementFilterReminders: string[];
	elementNbFilterReminders: {
		min: number;
		max: number;
	} | null;
	sourceTypeFilterReminders: string[];
	agentActivityFilterReminders: string[];
	agentStatusFilterReminders: string[];
	agentivityFilterReminders: string[];
	sourceMaterialFilterReminders: string[];
	languageFilterReminders: Record<string, boolean>;
	genderFilterReminders: Record<string, boolean>;
};

type Action = {
	resetTemporaryReminderValues: () => void;
	resetFilterReminders: () => void;

	// setters pour les valeurs temporaires
	setLocationNameValues: (locationNameValues: string[]) => void;
	setElementNameValues: (elementNameValues: string[]) => void;
	setElementNbValues: (
		elementNbValues: {
			min: number;
			max: number;
		} | null,
	) => void;
	setSourceTypeValues: (sourceTypeValues: string[]) => void;
	setAgentActivityValues: (agentActivityValues: string[]) => void;
	setAgentStatusValues: (agentStatusValues: string[]) => void;
	setAgentivityValues: (agentivityValues: string[]) => void;
	setSourceMaterialValues: (sourceMaterialValues: string[]) => void;

	// setters pour les reminders du titre de la carte
	setLocationFilterReminders: (locationFilterReminders: string[]) => void;
	setElementFilterReminders: (elementFilterReminders: string[]) => void;
	setElementNbFilterReminders: (
		elementNbFilterReminders: {
			min: number;
			max: number;
		} | null,
	) => void;
	setSourceTypeFilterReminders: (locationFilterReminders: string[]) => void;
	setAgentActivityFilterReminders: (
		agentActivityFilterReminders: string[],
	) => void;
	setAgentStatusFilterReminders: (agentStatusFilterReminders: string[]) => void;
	setAgentivityFilterReminders: (agentivityFilterReminders: string[]) => void;
	setSourceMaterialFilterReminders: (sourceMaterialName: string[]) => void;
	setLanguageFilterReminders: (
		languageFilterReminders: Record<string, boolean>,
	) => void;
	setGenderFilterReminders: (
		genderFilterReminders: Record<string, boolean>,
	) => void;
	resetLanguageFilterReminders: () => void;
};

export const useMapFilterReminderStore = create<State & Action>((set, get) => ({
	// stockage temporaire des reminders
	resetTemporaryReminderValues: () => {
		set(() => ({
			locationNameValues: [],
			elementNameValues: [],
			elementNbValues: null,
			sourceTypeValues: [],
			agentActivityValues: [],
			agentStatusValues: [],
			agentivityValues: [],
			sourceMaterialValues: [],
		}));
	},
	locationNameValues: [],
	setLocationNameValues: (locationNameValues) =>
		set(() => ({ locationNameValues })),
	elementNameValues: [],
	setElementNameValues: (elementNameValues) =>
		set(() => ({ elementNameValues })),
	elementNbValues: null,
	setElementNbValues: (elementNbValues) => set(() => ({ elementNbValues })),
	sourceTypeValues: [],
	setSourceTypeValues: (sourceTypeValues) => set(() => ({ sourceTypeValues })),
	agentActivityValues: [],
	setAgentActivityValues: (agentActivityValues) =>
		set(() => ({ agentActivityValues })),
	agentStatusValues: [],
	setAgentStatusValues: (agentStatusValues) =>
		set(() => ({ agentStatusValues })),
	agentivityValues: [],
	setAgentivityValues: (agentivityValues) => set(() => ({ agentivityValues })),
	sourceMaterialValues: [],
	setSourceMaterialValues: (sourceMaterialValues) =>
		set(() => ({ sourceMaterialValues })),

	// reminders pour le titre de la carte
	resetFilterReminders: () => {
		get().setLocationFilterReminders([]);
		get().setElementFilterReminders([]);
		get().setElementNbFilterReminders(null);
		get().setAgentActivityFilterReminders([]);
		get().setAgentStatusFilterReminders([]);
		get().setAgentivityFilterReminders([]);
		get().setSourceMaterialFilterReminders([]);
		get().setSourceTypeFilterReminders([]);
		get().setLanguageFilterReminders({ greek: false, semitic: false });
		get().setGenderFilterReminders({
			male: false,
			female: false,
			nonBinary: false,
		});
		get().resetLanguageFilterReminders();
	},
	locationFilterReminders: [],
	setLocationFilterReminders: (locationFilterReminders) =>
		set(() => ({ locationFilterReminders })),
	elementFilterReminders: [],
	setElementFilterReminders: (elementFilterReminders) =>
		set(() => ({ elementFilterReminders })),
	elementNbFilterReminders: null,
	setElementNbFilterReminders: (elementNbFilterReminders) =>
		set(() => ({ elementNbFilterReminders })),
	sourceTypeFilterReminders: [],
	setSourceTypeFilterReminders: (sourceTypeFilterReminders) =>
		set(() => ({ sourceTypeFilterReminders })),
	agentActivityFilterReminders: [],
	setAgentActivityFilterReminders: (agentActivityFilterReminders) =>
		set(() => ({ agentActivityFilterReminders })),
	agentStatusFilterReminders: [],
	setAgentStatusFilterReminders: (agentStatusFilterReminders) =>
		set(() => ({ agentStatusFilterReminders })),
	agentivityFilterReminders: [],
	setAgentivityFilterReminders: (agentivityFilterReminders) =>
		set(() => ({ agentivityFilterReminders })),
	sourceMaterialFilterReminders: [],
	setSourceMaterialFilterReminders: (sourceMaterialFilterReminders) =>
		set(() => ({ sourceMaterialFilterReminders })),
	languageFilterReminders: { greek: false, semitic: false },
	setLanguageFilterReminders: (languageFilterReminders) =>
		set(() => ({ languageFilterReminders })),
	resetLanguageFilterReminders: () =>
		set(() => ({ languageFilterReminders: { greek: false, semitic: false } })),
	genderFilterReminders: { male: false, female: false, nonBinary: false },
	setGenderFilterReminders: (genderFilterReminders) =>
		set(() => ({ genderFilterReminders })),
}));
