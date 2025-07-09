// import des bibliothèques
import { create } from "zustand";

type State = {
	locationFilterReminders: string[];
	elementFilterReminders: string[];
	sourceTypeFilterReminders: string[];
	agentActivityFilterReminders: string[];
	agentStatusFilterReminders: string[];
	agentivityFilterReminders: string[];
	sourceMaterialFilterReminders: string[];
	languageFilterReminders: Record<string, boolean>;
	genderFilterReminders: Record<string, boolean>;
};

type Action = {
	resetFilterReminders: () => void;
	setLocationFilterReminders: (locationFilterReminders: string[]) => void;
	setElementFilterReminders: (elementFilterReminders: string[]) => void;
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
	resetFilterReminders: () => {
		get().setLocationFilterReminders([]);
		get().setElementFilterReminders([]);
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
	},
	locationFilterReminders: [],
	setLocationFilterReminders: (locationFilterReminders) =>
		set(() => ({ locationFilterReminders })),
	elementFilterReminders: [],
	setElementFilterReminders: (elementFilterReminders) =>
		set(() => ({ elementFilterReminders })),
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
