// import des types
import type {
	Language,
	LanguageObject,
	TranslationType,
} from "../types/languageTypes";
import type {
	PointType,
	ElementType,
	MapFilterType,
	GreatRegionType,
	TimeMarkersType,
} from "../types/mapTypes";
import type { MultiValue } from "react-select";
import type { OptionType } from "../types/commonTypes";
import type { UserFilterType } from "../types/filterTypes";

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
 * Fonction qui créé les options pour le select du filtre temporel
 * @param {TimeMarkersType} timeMarkers - Les bornes temporelles
 * @returns {string[]} - Un tableau avec la liste des options temporelles
 */
const createTimeOptions = (timeMarkers: TimeMarkersType) => {
	const options = [];
	for (let i = timeMarkers.post; i <= timeMarkers.ante; i += 100) {
		options.push({ value: i, label: i.toString() });
	}
	return options;
};

/**
 * Fonction qui formate les données pour le select de react-select (sortie {value, label})
 * @param {MapFilterType} mapFilters - Les filtres de la carte en construction
 * @returns {OptionType[]} - Un tableau d'options formatées
 */
const formatDataForReactSelect = (
	dataArray: GreatRegionType[],
	language: string,
) => {
	return dataArray.map((data) => ({
		value: data.id,
		label: data[`nom_${language}` as keyof GreatRegionType] as string,
	}));
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
) => {
	const minValNumber =
		typeof minVal === "string" ? Number.parseInt(minVal, 10) : minVal;
	const maxValNumber =
		typeof maxVal === "string" ? Number.parseInt(maxVal, 10) : maxVal;

	const labelsArray = [];
	for (let i = minValNumber; i <= maxValNumber; i += 100) {
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
	const allLocations: Record<string, string>[] = [];
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
 * Fonction qui renvoie les valeurs par défaut des filtres, formatées pour le select
 * @param {MapFilterType} userFilters - Les filtres de l'utilisateur
 * @param {OptionType[]} listOptions - Les options du select
 * @returns {OptionType[]} - Les options du select filtrées et formatées
 */
const getSelectDefaultValues = (
	userFiltersListId: string,
	listOptions: OptionType[],
) => {
	if (!userFiltersListId) return [];

	// convertir les valeurs en nombre
	const locationIds = userFiltersListId
		.split("|")
		.map((id) => Number.parseInt(id, 10));

	// trouver les options correspondantes
	return listOptions.filter((option) =>
		locationIds.includes(option.value as number),
	);
};

const handleMultiSelectChange = (
	key: string,
	selectedOptions: MultiValue<OptionType>,
	setUserFilters: (filters: UserFilterType) => void,
	userFilters: UserFilterType,
	setAfterValue: (value: OptionType) => void,
	setBeforeValue: (value: OptionType) => void,
) => {
	if (key === "locationId" || key === "elementId") {
		const newValues = (selectedOptions as MultiValue<OptionType>)
			.map((option) => option.value)
			.join("|");

		setUserFilters({
			...userFilters,
			[key]: newValues,
		});
	}
	if (key === "post") {
		setAfterValue(selectedOptions[0]);
		// on met à jour les userFilters au moment du submit pour éviter de modifier le filtre temporel (qui est visible)
	}
	if (key === "ante") {
		setBeforeValue(selectedOptions[0]);
		// on met à jour les userFilters au moment du submit pour éviter de modifier le filtre temporel (qui est visible)
	}
};

/**
 * Fonction qui gère les changements de select générés par l'utilisateur et stocke les valeurs dans le filtre des éléments
 * @param {MultiValue<OptionType>} selectedOptions - Les options sélectionnées
 * @param {string} key - La clé du filtre
 * @param {Function} setUserFilters - La fonction pour mettre à jour les filtres de l'utilisateur
 * @param {MapFilterType} userFilters - Les filtres de l'utilisateur
 * @returns {void} - Ne retourne rien
 */
const onMultiSelectChange = (
	selectedOptions: MultiValue<OptionType>,
	key: string,
	setUserFilters: (filters: UserFilterType) => void,
	userFilters: UserFilterType,
	setValuesFunction: (names: string[]) => void,
) => {
	// stockage des valeurs dans le store pour les afficher dans le rappel de la carte
	const newValues = (selectedOptions as MultiValue<OptionType>).map(
		(option) => option.label,
	);

	setValuesFunction(newValues);

	const elementValuesString = selectedOptions
		.map((option) => option.value)
		.join("|");

	setUserFilters({
		...userFilters,
		[key]: elementValuesString,
	});
};

/**
 * Fonction qui vérifie si aucun filtre de la carte n'est sélectionné par l'utilisateur lors de la création ou modification
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

/**
 * Fonction qui vérifie si aucun filtre n'est sélectionné par l'utilisateur
 * @param {UserFilterType} userFilters - Les filtres de la carte en construction
 * @returns {boolean} - Un booléen
 */
const noUserFilterChecked = (userFilters: UserFilterType) => {
	let filtersChecked = 0;
	for (const filter in userFilters) {
		if (
			(filter === "post" || filter === "ante") &&
			userFilters[filter as keyof UserFilterType]
		) {
			filtersChecked += 1;
		}
	}
	return filtersChecked === 0;
};

/**
 * Fonction qui vérifie si aucun filtre n'est sélectionné par l'utilisateur
 * @param {UserFilterType} userFilters - Les filtres de la carte en construction
 * @param {string[]} locationNames - Les noms des localités sélectionnées
 * @param {string[]} elementNames - Les noms des éléments sélectionnés
 * @param {Record<string, boolean>} languageValues - Un objet contenant les booléens des langues sélectionnées
 * @param {TranslationType} translationObject - Les objets de traduction
 * @returns {Array} - Un tableau de strings
 */
const displayFiltersTags = (
	userFilters: UserFilterType,
	locationNames: string[],
	elementNames: string[],
	languageValues: Record<string, boolean>,
	translationObject: LanguageObject,
) => {
	const stringArray = [];

	// affichage des dates
	if (userFilters.post !== -1000 || userFilters.ante !== 400) {
		if (userFilters.post)
			stringArray.push(`${translationObject.common.after} ${userFilters.post}`);
		if (userFilters.ante)
			stringArray.push(
				`${translationObject.common.before} ${userFilters.ante}`,
			);
	}

	// affichage des langues
	if (languageValues.greek && languageValues.semitic) {
		stringArray.push(translationObject.mapPage.noGreekOrSemitic);
	} else if (languageValues.greek) {
		stringArray.push(translationObject.mapPage.onlySemitic);
	} else if (languageValues.semitic) {
		stringArray.push(translationObject.mapPage.onlyGreek);
	}

	// affichage des lieux
	if (locationNames.length)
		stringArray.push(
			`${translationObject.common.in} ${locationNames.join(", ")}`,
		);

	// affichage des éléments
	if (elementNames.length)
		stringArray.push(
			`${translationObject.mapPage.withElements}  : ${elementNames.join(", ")}`,
		);

	return stringArray;
};

export {
	alreadyTwoFiltersChecked,
	createTimeOptions,
	formatDataForReactSelect,
	getAllDatationLabels,
	getAllElementsFromPoints,
	getAllLocationsFromPoints,
	getFilterLabel,
	getPointsTimeMarkers,
	getSelectDefaultValues,
	handleMultiSelectChange,
	onMultiSelectChange,
	noFilterChecked,
	noUserFilterChecked,
	displayFiltersTags,
};
