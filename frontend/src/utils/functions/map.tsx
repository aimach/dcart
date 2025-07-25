// import des bibliothèques
import DOMPurify from "dompurify";
import * as LucideIcons from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import html2canvas from "html2canvas";
// import des types
import type { Language, TranslationType } from "../types/languageTypes";
import type {
	SourceType,
	PointType,
	AgentType,
	MapType,
	MenuTabType,
	MapInfoType,
	AttestationType,
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
	parsedPoints: { id: string }[],
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

	let genderString = "";
	if (agentElement.genres?.length === 1) {
		genderString =
			agentElement.genres[0].nom_fr === "Masculin" ? " (M)" : " (F)";
	} else if (agentElement.genres?.length > 1) {
		genderString = " (M/F)";
	}

	return sanitizedAgentInSelectedLanguage.length > 1
		? sanitizedAgentInSelectedLanguage[language === "fr" ? 0 : 1] + genderString
		: sanitizedAgentInSelectedLanguage[0] + genderString;
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

	let string = `${translation[language].common.createdOn} ${creationDate} ${translation[language].common.by} ${
		itemInfos.creator?.pseudo ?? ""
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

		string += ` - ${translation[language].common.updatedOn} ${modificationDate} ${translation[language].common.by} ${
			itemInfos.modifier.pseudo
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
		// @ts-ignore
		<Icon size={options?.size || 24} color={options?.color || "black"} />,
	);

	return svgString;
};

/**
 * Fonction pour gérer le survol de la souris sur un cluster
 * @param {Event} e - L'événement de la souris
 */
// @ts-ignore
const handleClusterMouseOver = (e: L.MarkerClusterMouseEvent) => {
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
	// @ts-ignore
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
	maxDistance = 50, // en mètres
): L.MarkerCluster | null => {
	let closestCluster: { cluster: L.MarkerCluster; dist: number } | null = null;

	map.eachLayer((layer) => {
		if (layer instanceof L.MarkerCluster) {
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

/**
 * Fonction pour charger la carte en png
 */
const uploadMapImage = (
	isMapReady: boolean,
	mapInfos: MapInfoType,
	language: Language,
	setMapIsDownloading: (isDownloading: boolean) => void,
) => {
	if (isMapReady) {
		setMapIsDownloading(true);

		// on cache le control zoom
		const controlZoomElements = document.querySelectorAll(
			".leaflet-control-zoom",
		);
		for (const element of controlZoomElements) {
			element.style.display = "none";
		}

		// on cache les checkbox de la légende
		const legendCheckboxs = document.querySelectorAll(
			".leaflet-control-layers-selector",
		);
		for (const input of legendCheckboxs) {
			input.style.display = "none";
		}

		const mapElement = document.getElementsByClassName(
			"leaflet-container",
		)[0] as HTMLElement; // le premier élément de la classe leaflet-container

		html2canvas(mapElement, { useCORS: true, allowTaint: true }).then(
			(canvas) => {
				const imgData = canvas.toDataURL("image/png");

				// Télécharger l'image
				const link = document.createElement("a");
				link.href = imgData;
				link.download = `carte-${slugify(mapInfos[`title_${language}`])}.png`;
				link.click();
				setMapIsDownloading(false);
				// on remet le control zoom
				for (const element of controlZoomElements) {
					element.style.display = "block";
				}
				// on remet les checkbox de la légende
				if (mapInfos.isLayered) {
					for (const checkbox of legendCheckboxs) {
						checkbox.style.display = "inline-block";
					}
				}
			},
		);
	}
};

/**
 * Fonction utilisée pour "sluger" une chaîne de caractères
 * @param str - La chaîne de caractères à sluger
 * @returns string - La chaîne de caractères slugée
 */
const slugify = (str: string) =>
	str
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // accents en caractères normaux
		.replace(/[^a-z0-9]+/g, "-") // caractères spéciaux en tirets
		.replace(/^-+|-+$/g, ""); // trim tirets

/**
 * Fonction utilisée pour définir l'attribution de la carte en fonction de l'URL du layer
 * @param {string} tileLayerURL - L'URL du layer
 * @returns {string} - L'attribution de la carte
 */
const getMapAttribution = (tileLayerURL: string): string => {
	return tileLayerURL.includes("openstreetmap")
		? '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
		: '<a href="https://cawm.lib.uiowa.edu/index.html" target="_blank" rel="noreferrer">Consortium of Ancient World Mappers</a> contributors';
};

const getOptionalCellValue = (
	attestation: AttestationType,
	key: string,
	translation: TranslationType,
	language: Language,
) => {
	const noDataMessage = translation[language].common.noData;
	if (!attestation.agents || attestation.agents.length === 0) {
		return noDataMessage;
	}

	if (key === "agentivity") {
		return attestation.agents
			.map((agent) => {
				if (!agent.agentivites) {
					return noDataMessage;
				}

				if (agent.agentivites[0].nom_fr === null) {
					return noDataMessage;
				}

				const arrayWithoutNulls = agent.agentivites.filter(
					(agentivity) => agentivity.nom_fr !== null,
				);

				if (arrayWithoutNulls.length === 0) {
					return noDataMessage;
				}

				return arrayWithoutNulls
					.map((agentivity) => agentivity[`nom_${language}`])
					.reduce((acc, agentivity) =>
						agentivity && acc.includes(agentivity)
							? acc
							: `${acc}, ${agentivity}`,
					);
			})
			.reduce((acc, agentivity) =>
				agentivity && acc.includes(agentivity) ? acc : `${acc}, ${agentivity}`,
			);
	}

	if (attestation.agents.length === 1 && attestation.agents[0][key] === null) {
		return noDataMessage;
	}

	const arrayWithoutNulls = (attestation.agents as AgentType[]).filter(
		(agent) => agent[key] !== null,
	);

	if (arrayWithoutNulls.length === 0) {
		return noDataMessage;
	}

	return arrayWithoutNulls
		.map((agent) => agent[key])
		.reduce((acc, current) =>
			current && acc.includes(current) ? acc : `${acc}, ${current}`,
		);
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
	uploadMapImage,
	getMapAttribution,
	getOptionalCellValue,
};
