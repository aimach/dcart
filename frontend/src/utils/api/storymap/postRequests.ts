// import des services
import { apiClient } from "../apiClient";
import { normalizeBody, requiredBlockKeys } from "../../functions/block";
import {
	notifyCreateSuccess,
	notifyEditSuccess,
	notifyError,
} from "../../functions/toast";
import { createPointSet } from "../builtMap/postRequests";
// import des types
import type { blockType } from "../../types/formTypes";
import type { PointSetType } from "../../types/mapTypes";
import type { StorymapBodyType } from "../../types/storymapTypes";

/**
 * Fonction pour insérer une nouvelle storymap dans la BDD
 * @param {storymapInputsType} body - le payload de la requête
 * @returns - l'id de la storymap
 */
const createStorymap = async (body: StorymapBodyType) => {
	try {
		const response = await apiClient("/storymap/storymap", {
			method: "POST",
			data: JSON.stringify(body),
		});
		notifyCreateSuccess("Storymap", true);
		return response.data;
	} catch (error) {
		if ((error as Error).message === "Request failed with status code 422") {
			notifyError(
				"Une étiquette au moins est nécessaire pour créer une storymap.",
			);
		} else {
			notifyError("Erreur lors de la création de la storymap");
		}
	}
};

/**
 * Fonction pour mettre à jour une storymap dans la BDD
 * @param {storymapInputsType} body - le payload de la requête
 * @param {string} storymapId - l'id de la storymap
 * @returns
 */
const updateStorymap = async (body: StorymapBodyType, storymapId: string) => {
	try {
		const response = await apiClient(`/storymap/storymap/${storymapId}`, {
			method: "PUT",
			data: JSON.stringify(body),
		});
		notifyEditSuccess("Storymap", true);
		return response.data.id;
	} catch (error) {
		notifyError("Erreur lors de la mise à jour de la storymap");
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
		notifyError("Erreur lors de la création du bloc");
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
		const response = await apiClient(`/storymap/blocks/${blockId}`, {
			method: "PUT",
			data: JSON.stringify(body),
		});
		return response.data;
	} catch (error) {
		notifyError("Erreur lors de la mise à jour du bloc");
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
	pointSet: PointSetType,
	storymapId: string,
	typeName: string,
	action: string,
	parentId?: string,
) => {
	try {
		let blockId = simpleMapInfos.id ?? "";
		if (action === "create") {
			// création du bloc de la carte
			const newMapInfos = await createBlock({
				...simpleMapInfos,
				storymapId,
				typeName,
				parentId,
			});
			blockId = newMapInfos?.id;

			const pointSetWithBlockId = {
				...pointSet,
				blockId,
			};

			// chargement des points
			await createPointSet(pointSetWithBlockId);

			notifyCreateSuccess(typeName === "step" ? "Etape" : "Carte simple", true);
		}
		if (action === "edit") {
			// mise à jour du bloc de la carte
			const updatedBlock = await updateBlock(
				{
					...simpleMapInfos,
					storymapId,
					typeName,
					parentId,
				},
				blockId,
			);
			// si l'utilisateur a chargé des points
			if (pointSet) {
				const pointSetWithBlockId = {
					...pointSet,
					name: updatedBlock.content1_lang1,
					blockId,
				};
				const initialPointSetId = updatedBlock.attestations[0]?.id;

				await apiClient(`/dcart/attestations/${initialPointSetId}`, {
					method: "DELETE",
				});

				// chargement des nouveaux points
				await createPointSet(pointSetWithBlockId);
			}
			notifyEditSuccess(typeName === "step" ? "Etape" : "Carte simple", true);
		}
	} catch (error) {
		notifyError("Erreur lors de la création d'une carte simple");
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
	blockParent: blockType,
	pointsSets: Record<string, PointSetType>,
	storymapId: string,
	typeName: string,
	action: string,
) => {
	try {
		let mapId = blockParent.id ?? "";
		if (action === "create") {
			// création du bloc de la carte
			const newMapInfos = await createBlock({
				...blockParent,
				storymapId,
				typeName,
			});
			mapId = newMapInfos?.id;

			// chargement des points pour les 2 panels
			for (const panelSide in pointsSets) {
				pointsSets[panelSide].blockId = mapId;

				await createPointSet(pointsSets[panelSide]);
			}
			notifyCreateSuccess("Carte de comparaison", true);
		}

		if (action === "edit") {
			// mise à jour du bloc de la carte
			const updatedBlock = await updateBlock(
				{
					...blockParent,
					storymapId,
					typeName,
				},
				mapId,
			);

			// chargement des points pour les 2 panels
			for (const panelSide in pointsSets) {
				const pointSetFromPanelSide = updatedBlock.attestations.find(
					(attestation: PointSetType) => attestation.name_fr === panelSide,
				);

				// s'il y a des points chargés, supression des anciens
				if (pointsSets[panelSide]) {
					await apiClient(`dcart/attestations/${pointSetFromPanelSide.id}`, {
						method: "DELETE",
					});
					pointsSets[panelSide].blockId = updatedBlock.id;

					// chargement des nouveaux points
					await createPointSet(pointsSets[panelSide]);
				}
			}
			notifyEditSuccess("Carte de comparaison", true);
		}
	} catch (error) {
		notifyError("Erreur lors de la création d'une carte de comparaison");
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
