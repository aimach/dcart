// import des services
import { apiClient } from "./apiClient";

/**
 * Récupère les traductions (avec ou sans clé)
 * @param translationKey - Clé de la traduction (optionnelle)
 * @returns {Promise<any>} - Renvoie les traductions
 */
const getTranslations = async (translationKey?: string) => {
	try {
		let query = "/translation";
		if (translationKey) {
			query += `?translationKey=${translationKey}`;
		}
		const response = await apiClient.get(query);
		return response.data;
	} catch (error) {
		console.error("Erreur lors du chargement de lat raduction:", error);
	}
};

/**
 * Fonction de modification d'une clé de traduction
 * @param translationObjectId - id de l'objet de traduction (français, anglais, etc.)
 * @param translationKey - Clé de la traduction
 * @param newValue - Nouvelle valeur de la traduction
 * @return {Promise<boolean>} - Renvoie la réponse de l'API
 */
const updateTranslationFromKey = async (
	translationObjectId: string,
	translationKey: string,
	newValue: string,
) => {
	try {
		const response = await apiClient(
			`/translation/${translationObjectId}?translationKey=${translationKey}`,
			{
				method: "PUT",
				data: { translation: newValue },
			},
		);
		return response.status;
	} catch (error) {
		console.error(
			"Erreur lors de la mise à jour d'une clé de traduction :",
			error,
		);
	}
};

export { getTranslations, updateTranslationFromKey };
