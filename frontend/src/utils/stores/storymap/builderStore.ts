// import des bibliothèques
import { create } from "zustand";
// import des types
import type { FormType } from "../utils/types/formTypes";
import type { BlockContentType } from "../utils/types/storymapTypes";

type State = {
	formType: FormType;
	block: BlockContentType | null;
	reload: boolean;
};

type Action = {
	updateFormType: (newFormType: State["formType"]) => void;
	updateBlockContent: (newBlock: State["block"]) => void;
	setReload: (reload: boolean) => void;
};

export const useBuilderStore = create<State & Action>((set) => ({
	formType: "blockChoice",
	updateFormType: (formType) =>
		set(() => ({
			formType: formType,
		})),
	block: null,
	updateBlockContent: (block) =>
		set(() => ({
			block: block,
		})),
	reload: false,
	setReload: (reload) => set(() => ({ reload })),
}));