// import des types
import type { TranslationObject } from "../../types/languageTypes";
import type { SourceType, PointType } from "../../types/mapTypes";
import type { Map as LeafletMap } from "leaflet";

// utilisée pour définir la couleur du background pour les markers en fonction du nombre de sources
const getBackGroundColorClassName = (sourcesNb: number) => {
	if (sourcesNb < 10) {
		return "lightBackgroundColor";
	}
	if (sourcesNb >= 10 && sourcesNb < 50) {
		return "mediumBackgroundColor";
	}
	if (sourcesNb >= 50) {
		return "darkBackgroundColor";
	}
	return "lightBackgroundColor";
};

// utilisée pour définir la taille de l'icone en fonction du nombre de sources
const getIconSize = (sourcesNb: number) => {
	if (sourcesNb < 10) {
		return 20;
	}
	if (sourcesNb >= 10 && sourcesNb < 50) {
		return 30;
	}
	if (sourcesNb >= 50) {
		return 40;
	}
	return 20;
};

// utilisée pour définir le couple support/matériau dans la langue choisie
const getSupportAndMaterialSentence = (
	source: SourceType,
	language: string,
) => {
	let bracketSentence = "";
	const supportKey = `support_${language}` as keyof SourceType;
	const materiauKey = `materiau_${language}` as keyof SourceType;

	if (source[supportKey]) {
		if (language === "fr") {
			bracketSentence = `(${source[supportKey]}`;
			if (source[materiauKey]) {
				bracketSentence += ` de ${source[materiauKey]}`;
			}
			bracketSentence += ")";
		} else {
			const materiau = source[materiauKey] ? `${source[materiauKey]} ` : "";
			bracketSentence = `(${materiau}${source[supportKey]})`;
		}
	}
	return bracketSentence;
};

// utilisée pour rédiger la phrase de la date
const getDatationSentence = (
	source: SourceType,
	translation: TranslationObject,
	language: string,
) => {
	return source.post_quem === source.ante_quem
		? `(${source.post_quem})`
		: `(${translation[language].common.between} ${source.post_quem} ${translation[language].common.and} ${source.ante_quem})`;
};

// utilisée pour zoomer sur un marker au click
const zoomOnMarkerOnClick = (map: LeafletMap, point: PointType) => {
	map.flyTo([point.latitude, point.longitude], 10);
};

export {
	getBackGroundColorClassName,
	getIconSize,
	getSupportAndMaterialSentence,
	getDatationSentence,
	zoomOnMarkerOnClick,
};
