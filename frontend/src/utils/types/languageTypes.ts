type Language = "en" | "fr";

type TranslationObject = {
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
		results: string;
		filters: string;
		filter: string;
		infos: string;
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
			searchForLocation: string;
		};
	};
};

type TranslationType = {
	en: TranslationObject;
	fr: TranslationObject;
};

export type { Language, TranslationObject, TranslationType };
