// import des services
import { apiClient } from "../apiClient";
import {
	addPanelToPoints,
	normalizeBody,
	requiredBlockKeys,
} from "../../functions/block";
// import des types
import type { storymapInputsType } from "../../types/formTypes";
import type { blockType, parsedPointType } from "../../types/formTypes";

/**
 * Fonction pour insérer une nouvelle storymap dans la BDD
 * @param {storymapInputsType} body - le payload de la requête
 * @returns - l'id de la storymap
 */
const createStorymap = async (body: storymapInputsType) => {
	try {
		const response = await apiClient("/storymap/storymap", {
			method: "POST",
			data: JSON.stringify(body),
		});
		return response.data.id;
	} catch (error) {
		console.error("Erreur lors de la création de la storymap :", error);
	}
};

/**
 * Fonction pour mettre à jour une storymap dans la BDD
 * @param {storymapInputsType} body - le payload de la requête
 * @param {string} storymapId - l'id de la storymap
 * @returns
 */
const updateStorymap = async (body: storymapInputsType, storymapId: string) => {
	try {
		const response = await apiClient(`/storymap/storymap/${storymapId}`, {
			method: "PUT",
			data: JSON.stringify(body),
		});
		return response.data.id;
	} catch (error) {
		console.error("Erreur lors de la mise à jour de la storymap :", error);
	}
};

/**
 * Fonction pour insérer un nouveau bloc dans la BDD
 * @param body - le payload de la requête
 * @returns - les informations du bloc inséré
 */
const createBlock = async (body: blockType) => {
	try {
		// ajout des clés manquantes avec une valeur null si elles ne sont pas complétées
		const newBody = normalizeBody(body, requiredBlockKeys);

		const response = await apiClient("/storymap/blocks", {
			method: "POST",
			data: JSON.stringify(newBody),
		});
		return response.data;
	} catch (error) {
		console.error("Erreur lors de la création du bloc :", error);
	}
};

/**
 * Fonction pour mettre à jour un bloc dans la BDD
 * @param body - le payload de la requête
 * @param blockId - l'id du bloc à mettre à jour
 * @returns - les informations du bloc inséré
 */
const updateBlock = async (body: blockType, blockId: string) => {
	try {
		// ajout des clés manquantes avec une valeur null si elles ne sont pas complétées
		const newBody = normalizeBody(body, requiredBlockKeys);

		const response = await apiClient(`/storymap/blocks/${blockId}`, {
			method: "PUT",
			data: JSON.stringify(newBody),
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

/**
 * Fonction pour créer ou éditer une carte simple + chargement des points associés
 * @param simpleMapInfos - les informations de la carte (payload pour la requête de la carte)
 * @param parsedPoints - le tableau des points parsés après chargement du csv (payload pour la requête des points)
 * @param storymapId - l'id de la storymap
 * @param typeName - le nom du type de bloc
 * @param action - l'action à effectuer (création ou édition)
 * @param parentId - l'id du bloc parent (si la carte est un bloc enfant)
 */
const uploadParsedPointsForSimpleMap = async (
	simpleMapInfos: blockType,
	parsedPoints: parsedPointType[],
	storymapId: string,
	typeName: string,
	action: string,
	parentId?: string,
) => {
	try {
		let mapId = simpleMapInfos.id ?? "";
		if (action === "create") {
			// création du bloc de la carte
			const newMapInfos = await createBlock({
				...simpleMapInfos,
				storymapId,
				typeName,
				parentId,
			});
			mapId = newMapInfos?.id;

			// chargement des points
			await apiClient(`/storymap/points/${mapId}`, {
				method: "POST",
				data: JSON.stringify({ parsedPoints }),
			});
		}
		if (action === "edit") {
			// mise à jour du bloc de la carte
			await updateBlock(
				{
					...simpleMapInfos,
					storymapId,
					typeName,
					parentId,
				},
				mapId,
			);
			// si l'utilisateur a chargé des points
			if (parsedPoints.length > 0) {
				// suppressino des anciens points
				await apiClient(`/storymap/points/${mapId}`, {
					method: "DELETE",
				});

				// chargement des nouveaux points
				await apiClient(`/storymap/points/${mapId}`, {
					method: "POST",
					data: JSON.stringify({ parsedPoints }),
				});
			}
		}
	} catch (error) {
		console.error("Erreur lors de la création d'une carte simple :", error);
	}
};

/**
 * Fonction pour créer ou éditer une carte déroulante + chargement des points associés
 * @param simpleMapInfos - les informations de la carte (payload pour la requête de la carte)
 * @param parsedPoints - le tableau des points parsés après chargement du csv (payload pour la requête des points)
 * @param storymapId - l'id de la storymap
 * @param typeName - le nom du type de bloc
 * @param action - l'action à effectuer (création ou édition)
 */
const uploadParsedPointsForComparisonMap = async (
	simpleMapInfos: blockType,
	parsedPoints: Record<string, parsedPointType[]>,
	storymapId: string,
	typeName: string,
	action: string,
) => {
	try {
		let mapId = simpleMapInfos.id ?? "";

		// modification des points pour ajouter l'informations du panel
		const parsedPointsWithPanel = addPanelToPoints(parsedPoints);

		if (action === "create") {
			// création du bloc de la carte
			const newMapInfos = await createBlock({
				...simpleMapInfos,
				storymapId,
				typeName,
			});
			mapId = newMapInfos?.data.id;

			// chargement des points pour les 2 panels
			for (const parsedPoints of parsedPointsWithPanel) {
				await apiClient(`/storymap/points/${mapId}`, {
					method: "POST",
					data: JSON.stringify({ parsedPoints }),
				});
			}
		}

		if (action === "edit") {
			// mise à jour du bloc de la carte
			await updateBlock(
				{
					...simpleMapInfos,
					storymapId,
					typeName,
				},
				mapId,
			);

			// chargement des points pour les 2 panels
			for (const parsedPoints of parsedPointsWithPanel) {
				// s'il y a des points chargés, supression des anciens
				if (parsedPoints.length > 0) {
					await apiClient(
						`/storymap/points/${mapId}?pane=${parsedPoints[0].pane}`,
						{
							method: "DELETE",
						},
					);

					// chargement des nouveaux points
					await apiClient(`/storymap/points/${mapId}`, {
						method: "POST",
						data: JSON.stringify({ parsedPoints }),
					});
				}
			}
		}
	} catch (error) {
		console.error("Erreur lors de la création d'une carte déroulante :", error);
	}
};

export {
	createStorymap,
	updateStorymap,
	createBlock,
	updateBlock,
	uploadParsedPointsForSimpleMap,
	uploadParsedPointsForComparisonMap,
};
