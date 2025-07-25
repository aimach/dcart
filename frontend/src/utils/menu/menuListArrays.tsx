// import des types
import { useMemo } from "react";
import type { Language, TranslationType } from "../types/languageTypes";
import type { MapInfoType, MenuTabType, PointType } from "../types/mapTypes";

/**
 * Génère le tableau des éléments de la barre de navigation de la page d'accueil
 * @param {TranslationType} translation - L'objet de traduction
 * @param {Language} language - Le language choisit par l'utilisateur
 * @returns {NavList} - Le tableau des éléments de la barre de navigation
 */
const getHomePageMenuList = (
	translation: TranslationType,
	language: Language,
) => [
	{
		id: "maps",
		title: translation[language].navigation.explore,
		onClickFunction: undefined,
		route: "maps/categories",
	},
	{
		id: "storymaps",
		title: translation[language].navigation.discover,
		onClickFunction: undefined,
		route: "storymaps/categories",
	},
];

/**
 * Génère le tableau des éléments de la barre de navigation de la page menu
 * @param {TranslationType} translation - L'objet de traduction
 * @param {Language} language - Le language choisit par l'utilisateur
 * @returns {NavList} - Le tableau des éléments de la barre de navigation
 */
const getMenuPageMenuList = (
	translation: TranslationType,
	language: Language,
) => [
	{
		id: "home",
		title: translation[language].navigation.home,
		onClickFunction: undefined,
		route: "/",
	},
	{
		id: "maps",
		title: translation[language].navigation.maps,
		onClickFunction: undefined,
		route: "maps/categories",
	},
	{
		id: "storymaps",
		title: translation[language].navigation.storymaps,
		onClickFunction: undefined,
		route: "storymaps/categories",
	},
];

/**
 * Génère le tableau des éléments de la barre de navigation du header si l'utilisateur est un visiteur
 * @param {TranslationType} translation - L'objet de traduction
 * @param {Language} language - Le language choisit par l'utilisateur
 */
const getVisitorNavigationList = (
	translation: TranslationType,
	language: Language,
) => [
	{
		id: "home",
		title: translation[language].navigation.home,
		onClickFunction: undefined,
		route: "/",
	},
	{
		id: "maps",
		title: translation[language].navigation.maps,
		onClickFunction: undefined,
		route: "maps/categories",
	},
	{
		id: "storymaps",
		title: translation[language].navigation.storymaps,
		onClickFunction: undefined,
		route: "storymaps/categories",
	},
];

/**
 * Génère le tableau des éléments de la barre de navigation du header si l'utilisateur est un administrateur
 * @param {TranslationType} translation - L'objet de traduction
 * @param {Language} language - Le language choisit par l'utilisateur
 */
const getBackofficeNavigationList = (
	translation: TranslationType,
	language: Language,
) => [
	{
		id: "home",
		title: translation[language].navigation.backoffice,
		onClickFunction: undefined,
		route: "/backoffice",
		adminOnly: false,
	},
];

/**
 * Génère le tableau des éléments du menu traduction dans le header
 * @param {TranslationType} translation - L'objet de traduction
 * @param {Language} language - Le language choisit par l'utilisateur
 */
const getTranslationNavigationList = (
	translation: TranslationType,
	language: Language,
	switchLanguage: (newLanguage: Language) => void,
) => [
	{
		id: "fr",
		title: translation[language].fr,
		onClickFunction: () => switchLanguage("fr"),
		route: undefined,
	},
	{
		id: "en",
		title: translation[language].en,
		onClickFunction: () => switchLanguage("en"),
		route: undefined,
	},
];

/**
 * Génère le tableau des éléments de la barre de navigation du panel latéral de la carte
 * @param {TranslationType} translation - L'objet de traduction
 * @param {Language} language - Le language choisit par l'utilisateur
 */
const getAsideNavigationList = (
	translation: TranslationType,
	language: Language,
	allPoints: PointType[],
	allResults: PointType[],
	setSelectedTabMenu: (setSelectedTabMenu: MenuTabType) => void,
	mapInfos: MapInfoType | null,
) => {
	const allPointsLength = useMemo(() => {
		return mapInfos ? allResults.length : allPoints.length;
	}, [mapInfos, allPoints, allResults]);
	return [
		{
			id: "results",
			title: `${allPointsLength} ${translation[language].button.result}${
				allPointsLength > 1 ? "s" : ""
			}`,
			onClickFunction: () => setSelectedTabMenu("results"),
			route: undefined,
		},
		{
			id: "filters",
			title: translation[language].button.filters,
			onClickFunction: () => setSelectedTabMenu("filters"),
			route: undefined,
		},
		{
			id: "infos",
			title: translation[language].button.selection,
			onClickFunction: () => setSelectedTabMenu("infos"),
			route: undefined,
		},
	];
};

export {
	getHomePageMenuList,
	getMenuPageMenuList,
	getVisitorNavigationList,
	getBackofficeNavigationList,
	getTranslationNavigationList,
	getAsideNavigationList,
};
