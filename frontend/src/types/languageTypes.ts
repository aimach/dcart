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
	};
	button: {
		freeExploration: string;
		results: string;
		filters: string;
		infos: string;
	};
	common: {
		between: string;
		and: string;
	};
};

type TranslationType = {
	en: TranslationObject;
	fr: TranslationObject;
};

export type { Language, TranslationObject, TranslationType };
