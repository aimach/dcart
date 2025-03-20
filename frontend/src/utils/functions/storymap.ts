import type { InputType } from "../types/formTypes";
import type { Language } from "../types/languageTypes";
import type {
	CategoryType,
	StorymapLanguageType,
} from "../types/storymapTypes";

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

/**
 * Fonction pour créer les options du select des langues
 * @param languageArray - la liste des langues de la BDD
 * @param inputs - les inputs du formulaire
 * @returns un tableau contenant les inputs mis à jour avec la liste des options des catégories
 */
const createLanguageOptions = (
	languageArray: StorymapLanguageType[],
	inputs: InputType[],
) => {
	if (languageArray.length > 0) {
		// préparation des catégories pour les inputs
		const languageOptionArray = languageArray.map((language) => ({
			value: language.id,
			label: `${language.name.toUpperCase()} ${getFlagEmoji(language.name)}`,
		}));

		// récupération de l'id de l'input des catégories
		const lang1InputIndex = inputs.map((input) => input.name).indexOf("lang1");
		const lang2InputIndex = inputs.map((input) => input.name).indexOf("lang2");

		// insertion des nouvelles données
		inputs[lang1InputIndex].options = [
			{
				value: "0",
				label: "Choisissez une première langue",
			},
			...languageOptionArray,
		];
		inputs[lang2InputIndex].options = [
			{
				value: "0",
				label: "Choisissez une deuxième langue",
			},
			...languageOptionArray,
		];
		return [...inputs];
	}
	return [];
};

/**
 * Fonction qui définit l'emoji à ajouter à l'option de langue
 * @param language - la langue
 * @returns l'emoji correspondant à la langue
 */
const getFlagEmoji = (language: string) => {
	switch (language) {
		case "fr":
			return "🇫🇷";
		case "en":
			return "🇬🇧";
		case "es":
			return "🇪🇸";
		case "it":
			return "🇮🇹";
		default:
			return "";
	}
};

export { createCategoryOptions, createLanguageOptions };
