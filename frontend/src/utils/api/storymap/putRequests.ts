// import des serivces
import { notifyError, notifyPublicationSuccess } from "../../functions/toast";
import { apiClient } from "../apiClient";

/**
 * Envoie une requête PUT pour mettre à jour une carte
 * @param body - Les informations de la carte à mettre à jour
 * @returns {Promise} - La réponse de la requête
 */
const updateStorymapStatus = async (storymapId: string, status: boolean) => {
	try {
		const response = await apiClient(
			`storymap/storymap/${storymapId}?isActive=${status}`,
			{
				method: "PUT",
			},
		);
		notifyPublicationSuccess("Storymap", status);
		return response;
	} catch (error) {
		notifyError("Erreur lors de la mise à jour du statut de la storymap");
	}
};

export { updateStorymapStatus };
