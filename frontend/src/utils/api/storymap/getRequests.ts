// import des services
import { apiClient } from "../apiClient";
// import des types
import type { BlockContentType } from "../../types/storymapTypes";

/**
 * Fonction pour récupérer toutes les informations de la storymap (infos et blocks)
 * @param {string} storymapId - l'id de la storymap
 * @returns - les informations de la storymap
 */
const getStorymapInfosAndBlocks = async (storymapId: string) => {
	try {
		const response = await apiClient.get(`/storymap/storymap/${storymapId}`);
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors du chargement des données de la storymap (infos et blocks) :",
			error,
		);
	}
};

// ----------- CATEGORIES

/**
 * Fonction pour récupérer toutes les catégories des storymaps
 * @returns Un tableau de catégories
 */
const getAllStorymapCategories = async () => {
	try {
		const response = await apiClient.get("/storymap/categories/all");
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors du chargement des catégories des storymaps :",
			error,
		);
	}
};

// ----------- BLOCKS

/**
 * Mise à jour de la position des blocs après drag and drop
 * @param blocks - la liste des blocs (avec nouvelle position)
 */
const updateBlocksPosition = async (blocks: BlockContentType[]) => {
	try {
		await apiClient.put("/storymap/blocks/position/update", { blocks });
	} catch (error) {
		console.error(
			"Erreur lors de la mise à jour de la position des blocs :",
			error,
		);
	}
};

/**
 * Récupération des informations d'un bloc
 * @param blockId - id du bloc
 * @returns les informations du bloc
 */
const getBlockInfos = async (blockId: string) => {
	try {
		const response = await apiClient.get(`/storymap/blocks/${blockId}`);
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors du chargement des informations du bloc :",
			error,
		);
	}
};

// ----------- TYPES

/**
 * Fonction qui permet de récupérer tous les types de blocks
 * @returns les types de blocks sous la forme d'un tableau
 */
const getAllBlockTypes = async () => {
	try {
		const response = await apiClient.get("/storymap/types/all");
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement des types de bloc :", error);
	}
};

// ----------- LANGUAGES

/**
 * Fonction pour récupérer toutes les catégories des storymaps
 * @returns Un tableau de catégories
 */
const getAllStorymapLanguages = async () => {
	try {
		const response = await apiClient.get("/storymap/languages/all");
		return response.data;
	} catch (error) {
		console.error(
			"Erreur lors du chargement des langues des storymaps :",
			error,
		);
	}
};

export {
	getStorymapInfosAndBlocks,
	getAllStorymapCategories,
	getAllBlockTypes,
	updateBlocksPosition,
	getBlockInfos,
	getAllStorymapLanguages,
};
