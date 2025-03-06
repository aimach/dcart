// import des bibliothèques
import DOMPurify from "dompurify";
// import des types
import type { Language, TranslationType } from "../types/languageTypes";
import type {
	SourceType,
	PointType,
	AgentType,
	ParsedPointType,
} from "../types/mapTypes";
import type { Map as LeafletMap } from "leaflet";

/**
 * Fonction qui retourne un tableau d'agents sans doublons, établis à partir de la désignation
 * @param agentsArray - Un tableau d'agents
 * @returns {AgentType[]} - Un tableau d'agents sans doublons
 */
const getAgentsArrayWithoutDuplicates = (agentsArray: AgentType[]) => {
	const agentsWithoutDuplicates: AgentType[] = [];
	for (const agent of agentsArray) {
		if (
			!agentsWithoutDuplicates.find(
				(el) => el.designation === agent.designation,
			)
		) {
			agentsWithoutDuplicates.push(agent);
		}
	}
	return agentsWithoutDuplicates;
};

/**
 * Fonction qui retourne une chaîne de caractères contenant tous les ids des attestations d'un tableau de points donné
 * @param {PointType[]} parsedPoints - Un tableau de points
 * @returns {string} - Une chaîne de caractères contenant tous les ids des attestations
 */
const getAllAttestationsIdsFromParsedPoints = (
	parsedPoints: ParsedPointType[],
): string => {
	let allAttestationsIds = "";
	parsedPoints.map((point) => {
		allAttestationsIds += `${point.id},`;
	});
	const allAttestationsIdsWithoutLastComma = allAttestationsIds.slice(0, -1);
	return allAttestationsIdsWithoutLastComma;
};

/**
 * Fonction qui définit la couleur du background pour les markers en fonction du nombre de sources
 * @param {number} sourcesNb - Le nombre de sources
 * @returns {string} - La classe CSS correspondante
 */
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

/**
 * Fonction qui renvoie une phrase de datation en fonction des dates et de la langue
 * @param {SourceType} source
 * @param {TranslationType} translation
 * @param {Language} language
 * @returns {string} - La phrase de datation
 */
const getDatationSentence = (
	source: SourceType,
	translation: TranslationType,
	language: Language,
) => {
	if (!source.post_quem && !source.ante_quem) {
		return `(${translation[language].common.unknownDate})`;
	}
	const postQuemWithOperator =
		source.post_quem > 0 ? `+${source.post_quem}` : source.post_quem;
	const anteQuemWithOperator =
		source.ante_quem > 0 ? `+${source.ante_quem}` : source.ante_quem;
	return source.post_quem === source.ante_quem
		? `(${postQuemWithOperator})`
		: `(${translation[language].common.between} ${postQuemWithOperator} ${translation[language].common.and} ${anteQuemWithOperator})`;
};

/**
 * Fonction qui nettoie le texte HTML des agents pour pouvoir utiliser dangerouslySetInnerHTML
 * @param {AgentType} agentElement -
 * @returns {string} - La désignation de l'agent
 */
const getSanitizedAgent = (
	agentElement: AgentType,
	translation: TranslationType,
	language: Language,
) => {
	if (!agentElement.designation) {
		return `(${translation[language].mapPage.aside.noDesignation})`;
	}

	const sanitizedAgent = DOMPurify.sanitize(agentElement.designation);
	const sanitizedAgentInSelectedLanguage = sanitizedAgent.split("<br>");
	return sanitizedAgentInSelectedLanguage.length > 1
		? sanitizedAgentInSelectedLanguage[language === "fr" ? 0 : 1]
		: sanitizedAgentInSelectedLanguage[0];
};

/**
 * Fonction qui compare le point sélectionné et un point donné
 * @param {PointType} selectedMarker
 * @param {PointType} point
 * @returns {boolean} - true si les points sont identiques, false sinon
 */
const isSelectedMarker = (
	selectedMarker: PointType,
	point: PointType,
): boolean => {
	if (selectedMarker) {
		return (
			`${point.latitude}-${point.longitude}` ===
			`${(selectedMarker as PointType).latitude}-${(selectedMarker as PointType).longitude}`
		);
	}
	return false;
};

/**
 * Fonction qui permet de zoomer sur un marker lorsqu'on clique dessus
 * @param {Map} map - la carte en cours
 * @param {PointType} point - le point en cours
 */
const zoomOnMarkerOnClick = (map: LeafletMap, point: PointType) => {
	map.flyTo([point.latitude, point.longitude], 10);
};

export {
	getAgentsArrayWithoutDuplicates,
	getAllAttestationsIdsFromParsedPoints,
	getBackGroundColorClassName,
	getDatationSentence,
	getSanitizedAgent,
	isSelectedMarker,
	zoomOnMarkerOnClick,
};
