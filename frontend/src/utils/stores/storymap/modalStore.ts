// import des bibliothèques
import { create } from "zustand";
// import des types

type State = {
	isDeleteModalOpen: boolean;
};

type Action = {
	openDeleteModal: () => void;
	closeDeleteModal: () => void;
};

export const useModalStore = create<State & Action>((set) => ({
	isDeleteModalOpen: false,
	openDeleteModal: () => set(() => ({ isDeleteModalOpen: true })),
	closeDeleteModal: () => set(() => ({ isDeleteModalOpen: false })),
}));
