// import des bibliothèques
import { create } from "zustand";

type State = {
	isDeleteModalOpen: boolean;
	isUpdateModalOpen: boolean;
	idToDelete: string;
	idToUpdate: string;
	reload: boolean;
};

type Action = {
	openDeleteModal: () => void;
	closeDeleteModal: () => void;
	openUpdateModal: () => void;
	closeUpdateModal: () => void;
	setIdToDelete: (id: string) => void;
	setIdToUpdate: (id: string) => void;
	setReload: (reload: boolean) => void;
};

export const useModalStore = create<State & Action>((set) => ({
	isDeleteModalOpen: false,
	openDeleteModal: () => set(() => ({ isDeleteModalOpen: true })),
	closeDeleteModal: () => set(() => ({ isDeleteModalOpen: false })),
	idToDelete: "",
	isUpdateModalOpen: false,
	openUpdateModal: () => set(() => ({ isUpdateModalOpen: true })),
	closeUpdateModal: () => set(() => ({ isUpdateModalOpen: false })),
	idToUpdate: "",
	setIdToDelete: (id: string) => set(() => ({ idToDelete: id })),
	setIdToUpdate: (id: string) => set(() => ({ idToUpdate: id })),
	reload: false,
	setReload: (reload: boolean) => set(() => ({ reload: reload })),
}));
