type Language = "en" | "fr";

type LanguageObject = {
	title: string;
	en: string;
	fr: string;
	navigation: {
		home: string;
		maps: string;
		storymaps: string;
		backoffice: string;
		translation: string;
		back: string;
		explore: string;
		discover: string;
	};
	button: {
		freeExploration: string;
		result: string;
		filters: string;
		filter: string;
		selection: string;
		seeSources: string;
		seeAll: string;
		epithet: string;
		gender: string;
		activity: string;
		doughnut: string;
		bar: string;
		resetFilter: string;
	};
	common: {
		between: string;
		and: string;
		or: string;
		unknownDate: string;
		greek: string;
		semitic: string;
		previous: string;
		next: string;
	};
	modal: {
		firstContent: string;
		secondContent: string;
		chooseRegion: string;
		chooseDivinity: string;
		postDate: string;
		anteDate: string;
	};
	mapPage: {
		introduction: string;
		noResult: string;
		aside: {
			filters: string;
			sources: string;
			epithet: string;
			noFilter: string;
			location: string;
			element: string;
			language: string;
			seeStat: string;
			seeSources: string;
			searchForLocation: string;
			searchForElement: string;
			noSelectedMarker: string;
			traduction: string;
			originalVersion: string;
			agents: string;
			noAgent: string;
			noDesignation: string;
		};
	};
	backoffice: {
		mapFormPage: {
			addMapIntro: string;
			addMapPoints: string;
			uploadPoints: string;
			addFilters: string;
			filterIntroduction: string;
			locationFilter: string;
			languageFilter: string;
			epithetFilter: string;
			noFilter: string;
			create: string;
		};
	};
};

type TranslationType = {
	en: LanguageObject;
	fr: LanguageObject;
};

export type { Language, LanguageObject, TranslationType };
