// import des services
import { apiClient } from "./apiClient";

/**
 * Récupère les traductions (avec ou sans clé)
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

export { getTranslations };
