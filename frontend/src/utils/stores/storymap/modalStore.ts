// import des bibliothèques
import { create } from "zustand";
// import des types

type State = {
	isDeleteModalOpen: boolean;
	idToDelete: string;
};

type Action = {
	openDeleteModal: () => void;
	closeDeleteModal: () => void;
	setIdToDelete: (id: string) => void;
};

export const useModalStore = create<State & Action>((set) => ({
	isDeleteModalOpen: false,
	openDeleteModal: () => set(() => ({ isDeleteModalOpen: true })),
	closeDeleteModal: () => set(() => ({ isDeleteModalOpen: false })),
	idToDelete: "",
	setIdToDelete: (id: string) => set(() => ({ idToDelete: id })),
}));
