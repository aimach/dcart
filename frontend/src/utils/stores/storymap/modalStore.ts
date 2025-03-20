// import des bibliothèques
import { create } from "zustand";

type State = {
	isDeleteModalOpen: boolean;
	idToDelete: string;
	reload: boolean;
};

type Action = {
	openDeleteModal: () => void;
	closeDeleteModal: () => void;
	setIdToDelete: (id: string) => void;
	setReload: (reload: boolean) => void;
};

export const useModalStore = create<State & Action>((set) => ({
	isDeleteModalOpen: false,
	openDeleteModal: () => set(() => ({ isDeleteModalOpen: true })),
	closeDeleteModal: () => set(() => ({ isDeleteModalOpen: false })),
	idToDelete: "",
	setIdToDelete: (id: string) => set(() => ({ idToDelete: id })),
	reload: false,
	setReload: (reload: boolean) => set(() => ({ reload: reload })),
}));
