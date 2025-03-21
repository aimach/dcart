// import des bibliothèques
import { create } from "zustand";

type State = {
	selectedLanguage: "lang1" | "lang2";
};

type Action = {
	setSelectedLanguage: (language: "lang1" | "lang2") => void;
	resetSelectedLanguage: () => void;
};

export const useStorymapLanguageStore = create<State & Action>((set) => ({
	selectedLanguage: "lang1",
	setSelectedLanguage: (language: "lang1" | "lang2") =>
		set(() => ({ selectedLanguage: language })),
	resetSelectedLanguage: () => set(() => ({ selectedLanguage: "lang1" })),
}));
