// import des types
import type { TranslationType } from "../types/languageTypes";
import type { PointType, ElementType, MapFilterType } from "../types/mapTypes";

/**
 * Fonction qui vérifie si deux filtres sont déjà sélectionnés parmi les inputs
 * @param {MapFilterType} mapFilters - Les filtres de la carte en construction
 * @returns {boolean} - Un booléen
 */
const alreadyTwoFiltersChecked = (mapFilters: MapFilterType) => {
	let filtersChecked = 0;
	for (const filter in mapFilters) {
		if (mapFilters[filter as keyof MapFilterType]) {
			filtersChecked += 1;
		}
	}
	return filtersChecked >= 2;
};

/**
 * Fonction qui renvoie la liste des labels de datation en fonction des bornes et de l'écart donné
 * @param {number} minVal
 * @param {number} maxVal
 * @param {number} step
 * @returns {string[]} - Un tableau de labels
 */
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

/**
 * Fonction qui renvoie tous les éléments d'une liste de points donnée
 * @param {PointType[]} points - Les points
 * @returns {ElementType[]} - Le tableau des éléments
 */
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

/**
 * Fonction qui renvoie tous les lieux d'une liste de points donnée
 * @param {PointType[]} points - Les points
 * @returns {Record<string, string>[]} - Le tableau des lieux
 */
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

/**
 * Fonction qui renvoie le label du filtre en fonction de son type
 * @param {string} filterType - Le type du filtre
 * @param {TranslationType} translation - Les objets de traduction
 * @param {string} language - La langue sélectionnée par l'utilisateur
 * @returns {string} - Le label à afficher dans le formulaire
 */
const getFilterLabel = (
	filterType: string,
	translation: TranslationType,
	language: string,
) => {
	switch (filterType) {
		case "location":
			return translation[language as keyof TranslationType].backoffice
				.mapFormPage.locationFilter;
		case "language":
			return translation[language as keyof TranslationType].backoffice
				.mapFormPage.languageFilter;
		case "element":
			return translation[language as keyof TranslationType].backoffice
				.mapFormPage.epithetFilter;
		default:
			break;
	}
};

/**
 * Fonction qui renvoie les bornes temporelles d'une liste de points donnée
 * @param {PointType[]} allPoints - Les points
 * @returns {{ post: number, ante: number }} - Les bornes temporelles
 */
const getPointsTimeMarkers = (allPoints: PointType[]) => {
	const timeMarkers = { post: 400, ante: -1000 };
	for (const points of allPoints) {
		for (const source of points.sources) {
			if (source.ante_quem > timeMarkers.ante) {
				// on arrondit le chiffre pour avoir un multiple de 10 et mieux gérer l'échelle du filtre du temps
				timeMarkers.ante = Math.ceil(source.ante_quem / 10) * 10;
			}
			if (source.post_quem < timeMarkers.post) {
				// on arrondit le chiffre pour avoir un multiple de 10 et mieux gérer l'échelle du filtre du temps
				timeMarkers.post = Math.floor(source.post_quem / 10) * 10;
			}
		}
	}
	return timeMarkers;
};

/**
 * Fonction qui vérifie si aucun filtre n'est sélectionné
 * @param {MapFilterType} mapFilters - Les filtres de la carte en construction
 * @returns {boolean} - Un booléen
 */
const noFilterChecked = (mapFilters: MapFilterType) => {
	let filtersChecked = 0;
	for (const filter in mapFilters) {
		if (mapFilters[filter as keyof MapFilterType]) {
			filtersChecked += 1;
		}
	}
	return filtersChecked === 0;
};

export {
	alreadyTwoFiltersChecked,
	getAllDatationLabels,
	getAllElementsFromPoints,
	getAllLocationsFromPoints,
	getFilterLabel,
	getPointsTimeMarkers,
	noFilterChecked,
};
