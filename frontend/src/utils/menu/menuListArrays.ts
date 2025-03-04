// import des types
import type { Language, TranslationType } from "../types/languageTypes";
import type { NavList } from "../types/commonTypes";

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
		route: "/storymaps",
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
		route: "/storymaps",
	},
];

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
		route: "/storymaps",
	},
];

const getBackofficeNavigationList = (
	translation: TranslationType,
	language: Language,
) => [
	{
		id: "home",
		title: translation[language].navigation.backoffice,
		onClickFunction: undefined,
		route: "/backoffice",
	},
	{
		id: "maps",
		title: translation[language].navigation.maps,
		onClickFunction: undefined,
		route: "/backoffice/maps",
	},
	{
		id: "storymaps",
		title: translation[language].navigation.storymaps,
		onClickFunction: undefined,
		route: "/backoffice/storymaps",
	},
	{
		id: "translation",
		title: translation[language].navigation.translation,
		onClickFunction: undefined,
		route: "/backoffice/translation",
	},
];

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

export {
	getHomePageMenuList,
	getMenuPageMenuList,
	getVisitorNavigationList,
	getBackofficeNavigationList,
	getTranslationNavigationList,
};
