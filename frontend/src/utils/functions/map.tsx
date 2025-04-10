// import des bibliothèques
import DOMPurify from "dompurify";
import * as LucideIcons from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
// import des types
import type { Language, TranslationType } from "../types/languageTypes";
import type {
	SourceType,
	PointType,
	AgentType,
	ParsedPointType,
	MapType,
	MenuTabType,
	MapInfoType,
} from "../types/mapTypes";
import type { LatLng, Map as LeafletMap, Point } from "leaflet";
import type { StorymapType } from "../types/storymapTypes";

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
		return translation[language].mapPage.aside.noDesignation;
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
			`${point.latitude}-${point.longitude}-${point.color}-${point.shape}` ===
			`${(selectedMarker as PointType).latitude}-${(selectedMarker as PointType).longitude}-${(selectedMarker as PointType).color}-${(selectedMarker as PointType).shape}`
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
	map.flyTo([point.latitude, point.longitude], 11, { animate: false });
};

/**
 * Fonction qui renvoie une chaîne de caractère affichant la date de création et le créateur, ainsi que, le cas échénant, la date de modification et le modificateur
 * @param {MapType | StorymapType} itemInfos - Les informations de la carte ou du récit
 * @param {TranslationType} translation - Les traductions
 * @param {Language} language - La langue
 */
const getCreationAndModificationString = (
	itemInfos: MapType | StorymapType,
	translation: TranslationType,
	language: Language,
) => {
	const creationDate = new Date(itemInfos.createdAt).toLocaleDateString(
		language,
		{
			year: "numeric",
			month: "long",
			day: "numeric",
		},
	);

	let string = `${translation[language].common.createdOn} ${creationDate} ${translation[language].common.by} ${itemInfos.creator.pseudo
		}`;

	if (itemInfos.modifier) {
		const modificationDate = new Date(itemInfos.updatedAt).toLocaleDateString(
			language,
			{
				year: "numeric",
				month: "long",
				day: "numeric",
			},
		);

		string += ` - ${translation[language].common.updatedOn} ${modificationDate} ${translation[language].common.by} ${itemInfos.modifier.pseudo
			}`;
	}

	if (itemInfos.uploadPointsLastDate) {
		string += ` - ${translation[language].common.lastUpdloadOn} ${new Date(
			itemInfos.uploadPointsLastDate,
		).toLocaleDateString(language, {
			year: "numeric",
			month: "long",
			day: "numeric",
		})}`;
	}
	return string;
};

/**
 * Fonction pour générer le code svg d'une icône lucide (peut être intégré dans du html)
 * @param iconName nom de l'icône Lucide
 * @param options taille et couleur
 * @returns {string} - code svg de l'icône
 */
const createLucideString = (
	iconName: string,
	options?: { size?: number; color?: string },
) => {
	const Icon = LucideIcons[iconName as keyof typeof LucideIcons];

	if (!Icon) {
		console.warn(`Lucide icon "${iconName}" not found`);
		return null;
	}

	const svgString = renderToStaticMarkup(
		<Icon size={options?.size || 24} color={options?.color || "black"} />,
	);

	return svgString;
};

/**
 * Fonction pour gérer le survol de la souris sur un cluster
 * @param {Event} e - L'événement de la souris
 */
const handleClusterMouseOver = (
	e: L.MarkerClusterMouseEvent
) => {
	const cluster = e.layer;
	const clusterFirstPoint = cluster.getAllChildMarkers()[0];

	const tooltipContent = clusterFirstPoint._tooltip?.options?.children;

	cluster
		.bindTooltip(tooltipContent, {
			permanent: false,
			direction: "top",
			offset: L.point(10, -20),
		})
		.openTooltip();
};

/**
 * Fonction pour gérer le clic sur un cluster
 * @param {Event} e - L'événement de la souris
 * @param {Map} map - La carte en cours
 * @param {Function} setSelectedMarker - Fonction pour mettre à jour le marker sélectionné
 */

const handleClusterClick = (
	e: L.MarkerClusterMouseEvent,
	map: LeafletMap,
	setSelectedMarker: (point: PointType) => void,
	allResults: PointType[],
	setSelectedTabMenu: (selectedTabMenu: MenuTabType) => void,
	setIsPanelDisplayed: (isPanelDisplayed: boolean) => void,
) => {
	const cluster = e.layer;
	const clickedLatLng = cluster.getLatLng();
	map.flyTo(cluster.getLatLng(), 11, {
		animate: false,
	});

	const closestCluster = getClosestCluster(map, clickedLatLng);

	const clusterPosition = cluster.getLatLng();
	const selectedPoint = allResults.filter(
		(point) =>
			point.latitude === clusterPosition.lat &&
			point.longitude === clusterPosition.lng,
	);

	setSelectedMarker(selectedPoint[selectedPoint.length - 1] as PointType); // on prend le dernier point du cluster, mais qui s'affiche en premier (à gauche) sur le spiderfy()
	setSelectedTabMenu("infos");
	setIsPanelDisplayed(true);

	if (closestCluster && map.hasLayer(closestCluster)) {
		closestCluster.spiderfy();
	}
};

/**
 * Fonction pour modifier la position des points lors du spiderfying
 * @param {number} count - Le nombre de points à afficher
 * @param {PointType} centerPt - Le point central
 */
const handleSpiderfyPosition = (count: number, centerPt: Point) => {
	const positions = [];
	const radius = 40;
	const startAngle = Math.PI; // 180°
	const angleStep = Math.PI / (count - 1);

	for (let i = 0; i < count; i++) {
		const angle = startAngle - i * angleStep;
		const x = centerPt.x + radius * Math.cos(angle);
		const y = centerPt.y + radius * Math.sin(angle);
		positions.push({ x, y });
	}

	return positions;
};

const zoomOnSelectedMarkerCluster = (
	map: LeafletMap,
	selectedMarker: PointType,
	mapInfos: MapInfoType | null,
) => {
	map.flyTo([selectedMarker.latitude, selectedMarker.longitude], 11, {
		animate: false,
	});

	if (mapInfos) {
		const tooltip = L.tooltip({
			direction: "top",
			offset: L.point(10, -20),
			permanent: false,
		})
			.setLatLng([selectedMarker.latitude, selectedMarker.longitude])
			.setContent(selectedMarker.nom_ville)
			.addTo(map);

		// fermer le tooltip après 2s
		setTimeout(() => map.closeTooltip(tooltip), 2000);
	}

	setTimeout(() => {
		const clickedLatLng = L.latLng(
			selectedMarker.latitude,
			selectedMarker.longitude,
		);
		const closestCluster = getClosestCluster(map, clickedLatLng);

		if (closestCluster && map.hasLayer(closestCluster)) {
			closestCluster.spiderfy();
		}
	}, 300);
};

/**
 * Fonction pour trouver le cluster le plus proche du point cliqué
 * @param {Map} map - La carte en cours

 */
const getClosestCluster = (
	map: LeafletMap,
	clickedLatLng: LatLng,
	maxDistance = 50 // en mètres
): L.MarkerCluster | null => {
	let closestCluster: { cluster: L.MarkerCluster; dist: number } | null = null;

	map.eachLayer((layer) => {
		if (
			layer instanceof L.MarkerCluster
		) {
			const dist = clickedLatLng.distanceTo(layer.getLatLng());
			if (!closestCluster || dist < closestCluster.dist) {
				closestCluster = { cluster: layer, dist };
			}
		}
	});

	if (closestCluster && closestCluster.dist <= maxDistance) {
		return closestCluster.cluster;
	}

	return null;
};

export {
	getAgentsArrayWithoutDuplicates,
	getAllAttestationsIdsFromParsedPoints,
	getBackGroundColorClassName,
	getDatationSentence,
	getSanitizedAgent,
	isSelectedMarker,
	zoomOnMarkerOnClick,
	getCreationAndModificationString,
	createLucideString,
	handleClusterMouseOver,
	handleClusterClick,
	handleSpiderfyPosition,
	zoomOnSelectedMarkerCluster,
};
