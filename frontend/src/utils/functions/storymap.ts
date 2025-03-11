import type { InputType } from "../types/formTypes";
import type { Language } from "../types/languageTypes";
import type { CategoryType } from "../types/storymapTypes";

/**
 * Fonction pour créer les options du select des catégories
 * @param categories - la liste des catégories de la BDD
 * @param language - le langage de l'utilisateur
 * @param inputs - les inputs du formulaire
 * @returns un tableau contenant les inputs mis à jour avec la liste des options des catégories
 */
const createCategoryOptions = (
	categories: CategoryType[],
	language: Language,
	inputs: InputType[],
) => {
	if (categories.length > 0) {
		// préparation des catégories pour les inputs
		const categoryArray = categories.map((category) => ({
			value: category.id,
			label: category[`name_${language}`],
		}));

		// récupération de l'id de l'input des catégories
		const categoryInputIndex = inputs
			.map((input) => input.name)
			.indexOf("category_id");

		// insertion des nouvelles données
		inputs[categoryInputIndex].options = [
			{
				value: "0",
				label: "Choisissez une catégorie",
			},
			...categoryArray,
		];
		return [...inputs];
	}
	return [];
};

export { createCategoryOptions };
