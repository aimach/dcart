// import des types
import type { Dispatch, SetStateAction } from "react";
import type { Language, TranslationType } from "../types/languageTypes";
import type {
	SourceType,
	PointType,
	AttestationType,
	ElementType,
	MapInfoType,
	AgentType,
} from "../types/mapTypes";
import { point, type Map as LeafletMap } from "leaflet";

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

// utilisée pour définir le couple support/matériau dans la langue choisie
const getSupportAndMaterialSentence = (
	source: SourceType,
	language: Language,
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

// utilisée pour zoomer sur un marker au click
const zoomOnMarkerOnClick = (map: LeafletMap, point: PointType) => {
	map.flyTo([point.latitude, point.longitude], 10);
};

// utilisée pour définir si c'est le marker sélectionné
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

// utilisée pour récupérer les épithètes
const getEpithetLabelsAndNb = (
	selectedDivinityId: string,
	point: PointType,
	language: Language,
) => {
	// en premier lieu, on stocke tous les éléments dans un tableau, excepté l'includedElement
	const allElementsOfPoint: ElementType[] = [];
	point.sources.map((source: SourceType) => {
		source.attestations.map((attestation: AttestationType) => {
			for (const element of attestation.elements) {
				if (element.element_id !== Number.parseInt(selectedDivinityId, 10)) {
					allElementsOfPoint.push(element);
				}
			}
		});
	});

	// en second lieu, on stocke le label et le nombre d'occurence pour chaque élément
	const datasAndLabelsArray: Record<string, number>[] = [];
	const isInArray = (element: ElementType) =>
		datasAndLabelsArray.find(
			(data) => data[element[`element_nom_${language}`]],
		);

	for (const element of allElementsOfPoint) {
		if (!isInArray(element)) {
			datasAndLabelsArray.push({ [element[`element_nom_${language}`]]: 1 });
		} else {
			const elementFound = datasAndLabelsArray.find((obj) =>
				// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
				obj.hasOwnProperty(element[`element_nom_${language}`]),
			);
			if (elementFound) {
				const key = element[`element_nom_${language}`] as string;
				elementFound[key] += 1;
			}
		}
	}

	// on trie le tableau par ordre décroissant
	const sortedDatasAndLabelsArray = [];
	for (const data of datasAndLabelsArray) {
		const key = Object.keys(data)[0];
		const value = Object.values(data)[0];
		sortedDatasAndLabelsArray.push([key, value]);
	}
	sortedDatasAndLabelsArray.sort((a, b) => (b[1] as number) - (a[1] as number));

	// on stocke les valeurs triées dans deux tableaux
	const labels: string[] = sortedDatasAndLabelsArray.map(
		(data) => data[0] as string,
	);
	const dataSets: number[] = sortedDatasAndLabelsArray.map(
		(data) => data[1] as number,
	);

	return { labels, dataSets };
};

// utilisée pour récupérer le genre des agents
const getAgentGenderLabelsAndNb = (point: PointType, language: Language) => {
	// en premier lieu, on stocke tous les agents dans un tableau
	const allAgentsGenderOfPoint: { nom_en: string; nom_fr: string }[] = [];
	point.sources.map((source: SourceType) => {
		source.attestations.map((attestation: AttestationType) => {
			// s'il y a un tableau agent
			if (attestation.agents) {
				for (const agent of attestation.agents) {
					// s'il le tableau des genres n'est pas vide
					if (agent.genres) {
						// si le tableau des genres contient plus d'un élément, on le remplace par un seul élément "mixed"
						if (agent.genres.length > 1) {
							allAgentsGenderOfPoint.push({
								nom_en: "Mixed",
								nom_fr: "Mixte",
							});
						} else {
							// sinon on ajoute l'agent tel quel
							allAgentsGenderOfPoint.push(agent.genres[0]);
						}
					} else {
						// si le tableau des genres est vide, on ajoute un élément "unknown"
						allAgentsGenderOfPoint.push({
							nom_en: "Unknown",
							nom_fr: "Indéterminé",
						});
					}
				}
			} else {
				allAgentsGenderOfPoint.push({
					nom_en: "Unknown",
					nom_fr: "Indéterminé",
				});
			}
		});
	});

	// en second lieu, on stocke le label et le nombre d'occurence pour chaque genre
	const datasAndLabelsArray: Record<string, number>[] = [];
	const isInArray = (gender: { nom_en: string; nom_fr: string }) =>
		datasAndLabelsArray.find((data) => data[gender[`nom_${language}`]]);

	for (const gender of allAgentsGenderOfPoint) {
		if (!isInArray(gender)) {
			datasAndLabelsArray.push({ [gender[`nom_${language}`]]: 1 });
		} else {
			const genderFound = datasAndLabelsArray.find((obj) =>
				// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
				obj.hasOwnProperty(gender[`nom_${language}`]),
			);
			if (genderFound) {
				const key = gender[`nom_${language}`];
				genderFound[key] += 1;
			}
		}
	}
	const labels: string[] = datasAndLabelsArray.map(
		(data) => Object.keys(data)[0],
	);
	const dataSets: number[] = datasAndLabelsArray.map(
		(data) => Object.values(data)[0],
	);

	return { labels, dataSets };
};

// utilisée pour récupérer l'activité des agents
const getAgentActivityLabelsAndNb = (point: PointType, language: Language) => {
	// en premier lieu, on stocke tous les agents dans un tableau
	const allAgentsActivityOfPoint: {
		activite_en: string;
		activite_fr: string;
	}[] = [];
	point.sources.map((source: SourceType) => {
		source.attestations.map((attestation: AttestationType) => {
			// s'il y a un tableau agent
			if (attestation.agents) {
				for (const agent of attestation.agents) {
					// si les activités ne sont pas nulles
					if (agent.activite_en && agent.activite_fr) {
						allAgentsActivityOfPoint.push({
							activite_en: agent.activite_en,
							activite_fr: agent.activite_fr,
						});
					} else {
						allAgentsActivityOfPoint.push({
							activite_en: "Unknown",
							activite_fr: "Indéterminé",
						});
					}
				}
			} else {
				allAgentsActivityOfPoint.push({
					activite_en: "Unknown",
					activite_fr: "Indéterminé",
				});
			}
		});
	});

	// en second lieu, on stocke le label et le nombre d'occurence pour chaque genre
	const datasAndLabelsArray: Record<string, number>[] = [];
	const isInArray = (activity: { activite_en: string; activite_fr: string }) =>
		datasAndLabelsArray.find((data) => data[activity[`activite_${language}`]]);

	for (const activity of allAgentsActivityOfPoint) {
		if (!isInArray(activity)) {
			datasAndLabelsArray.push({ [activity[`activite_${language}`]]: 1 });
		} else {
			const activityFound = datasAndLabelsArray.find((obj) =>
				// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
				obj.hasOwnProperty(activity[`activite_${language}`]),
			);
			if (activityFound) {
				const key = activity[`activite_${language}`];
				activityFound[key] += 1;
			}
		}
	}
	const labels: string[] = datasAndLabelsArray.map(
		(data) => Object.keys(data)[0],
	);
	const dataSets: number[] = datasAndLabelsArray.map(
		(data) => Object.values(data)[0],
	);

	return { labels, dataSets };
};

// utilisé pour récupérer l'url des localisations en fonction de la granularité du filtre
const getLocationLevel = (
	mapInfos: MapInfoType,
	setLocationLevel: Dispatch<SetStateAction<string>>,
) => {
	const locationType = (mapInfos as MapInfoType).locationType;

	// on définit l'url de la requête selon la granularité du filtre de localisation
	let locationLevel = "";

	switch (locationType) {
		case null:
			locationLevel = "greatRegion";
			break;
		case "greatRegion":
			locationLevel = "subRegion";
			break;
		default:
			locationLevel = "greatRegion";
			break;
	}
	setLocationLevel(locationLevel);
	return locationLevel;
};

const getAllDatationLabels = (
	minVal: number | string,
	maxVal: number | string,
	step: number,
) => {
	const minValNumber =
		typeof minVal === "string" ? Number.parseInt(minVal, 10) : minVal;
	const maxValNumber =
		typeof maxVal === "string" ? Number.parseInt(maxVal, 10) : maxVal;

	const labelsArray = [];
	for (let i = minValNumber; i <= maxValNumber; i += step) {
		if (!(i % 10)) {
			// si i finit par 0
			labelsArray.push(i.toString());
		}
	}
	return labelsArray;
};

const getAllElementsFromPoints = (points: PointType[]) => {
	const allElements: ElementType[] = [];
	points.map((point) => {
		point.sources.map((source) => {
			source.attestations.map((attestation) => {
				attestation.elements.map((element) => {
					if (!allElements.find((el) => el.element_id === element.element_id)) {
						allElements.push(element);
					}
				});
			});
		});
	});
	return allElements;
};

const getAllLocationsFromPoints = (points: PointType[]) => {
	const allLocations: { [key: string]: string }[] = [];
	points.map((point) => {
		if (
			allLocations.find((loc) => loc.sous_region_fr === point.sous_region_fr)
		) {
			return;
		}
		allLocations.push({
			grande_region_id: point.grande_region_id,
			grande_region_fr: point.grande_region_fr,
			grande_region_en: point.grande_region_en,
			sous_region_id: point.sous_region_id,
			sous_region_fr: point.sous_region_fr,
			sous_region_en: point.sous_region_en,
		});
	});
	return allLocations;
};

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

export {
	getBackGroundColorClassName,
	getSupportAndMaterialSentence,
	getDatationSentence,
	zoomOnMarkerOnClick,
	isSelectedMarker,
	getEpithetLabelsAndNb,
	getAgentGenderLabelsAndNb,
	getAgentActivityLabelsAndNb,
	getLocationLevel,
	getAllDatationLabels,
	getAllElementsFromPoints,
	getAllLocationsFromPoints,
	getAgentsArrayWithoutDuplicates,
};
