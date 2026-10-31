import type { CSSProperties } from "react";
import type { OptionType } from "../types/commonTypes";
import type { InputType } from "../types/formTypes";
import type { Language } from "../types/languageTypes";
import type { MapType } from "../types/mapTypes";
import type {
	StorymapLanguageType,
	StorymapType,
} from "../types/storymapTypes";

/**
 * Fonction pour créer les options du select des tags
 * @param tags - la liste des tags de la BDD
 * @param language - le langage de l'utilisateur
 * @param inputs - les inputs du formulaire
 * @returns un tableau contenant les inputs mis à jour avec la liste des options des tags
 */
const createTagOptions = (tagOptions: OptionType[], inputs: InputType[]) => {
	if (tagOptions.length > 0) {
		// récupération de l'id de l'input des tags
		const tagInputIndex = inputs.map((input) => input.name).indexOf("tag_id");

		// insertion des nouvelles données
		inputs[tagInputIndex].options = [
			{
				value: "0",
				label: "Choisissez un tag",
			},
			...tagOptions,
		];
		return [...inputs];
	}
	return [];
};

/**
 * Fonction pour créer les options du select des langues
 * @param languageArray - la liste des langues de la BDD
 * @param inputs - les inputs du formulaire
 * @returns un tableau contenant les inputs mis à jour avec la liste des options des langues
 */
const createLanguageOptions = (
	languageArray: StorymapLanguageType[],
	inputs: InputType[],
) => {
	if (languageArray.length > 0) {
		// préparation des catégories pour les inputs
		const languageOptionArray = languageArray.map((language) => ({
			value: language.id,
			label: `${language.name.toUpperCase()}`,
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
 * Fonction pour créer les options du select des cartes associées
 * @param mapArray - la liste des cartes publiées
 * @param inputs - les inputs du formulaire
 * @returns un tableau contenant les inputs mis à jour avec la liste des options des cartes
 */
const createMapOptions = (
	mapArray: MapType[],
	inputs: InputType[],
	language: Language,
) => {
	if (mapArray.length > 0) {
		// préparation des catégories pour les inputs
		const mapOptionArray = mapArray.map((map) => ({
			value: map.id,
			label: `${map[`title_${language}`]} (${map.isActive ? "publiée" : "non publiée"})`,
		}));

		// récupération de l'id de l'input des catégories
		const mapInputIndex = inputs
			.map((input) => input.name)
			.indexOf("relatedMap");

		// insertion des nouvelles données
		inputs[mapInputIndex].options = [
			{
				value: "0",
				label: "Choisissez une carte à associer",
			},
			...mapOptionArray,
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

/**
 * Fonction qui retourne un tableau contenant les inputs sans la lang2
 * @param inputs - le tableau des inputs à modifier
 * @returns un tableau contenant les inputs sans la lang2
 */
const removeLang2Inputs = (inputs: InputType[]) => {
	const newInputs = inputs.filter((input) => !input.name.includes("_lang2"));
	return newInputs;
};

/**
 * Fonction qui ajoute au label des inputs la langue correspondante
 * @param inputs - le tableau des inputs à modifier
 * @returns un tableau contenant les inputs sans la lang2
 */
const addLangageBetweenBrackets = (
	inputs: InputType[],
	storymapInfos: StorymapType,
) => {
	if (!storymapInfos) return inputs;
	return inputs.map((input) => {
		if (input.label_fr.includes("langue 1")) {
			return {
				...input,
				label_fr: `${input.label_fr} (${storymapInfos?.lang1?.name.toUpperCase()})`,
				label_en: `${input.label_en} (${storymapInfos?.lang1?.name.toUpperCase()})`,
			};
		}
		if (input.label_fr.includes("langue 2")) {
			return {
				...input,
				label_fr: `${input.label_fr} (${storymapInfos?.lang2?.name.toUpperCase()})`,
				label_en: `${input.label_en} ${storymapInfos?.lang2?.name.toUpperCase()})`,
			};
		}
		return input;
	});
};

/**
 * Fonction qui retourne le style du calque de l'image de couverture d'une storymap
 * L'image couvre toujours le bloc : le zoom l'agrandit autour du point focal
 * @param imageUrl - l'URL de l'image de couverture
 * @param zoom - le zoom en % (100 = sans zoom)
 * @param positionX - la position horizontale du point focal en % (0 = gauche)
 * @param positionY - la position verticale du point focal en % (0 = haut)
 * @returns le style à appliquer au calque de l'image
 */
const getCoverImageStyle = (
	imageUrl: string,
	zoom = 100,
	positionX = 50,
	positionY = 50,
): CSSProperties => ({
	backgroundImage: `url("${imageUrl}")`,
	backgroundSize: "cover",
	backgroundRepeat: "no-repeat",
	backgroundPosition: `${positionX}% ${positionY}%`,
	transform: `scale(${zoom / 100})`,
	transformOrigin: `${positionX}% ${positionY}%`,
});

export {
	createTagOptions,
	getCoverImageStyle,
	createLanguageOptions,
	getFlagEmoji,
	createMapOptions,
	removeLang2Inputs,
	addLangageBetweenBrackets,
};
