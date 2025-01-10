type Language = "en" | "fr";

type TranslationObject = {
	[key: string]: string | TranslationObject;
};

export type { Language, TranslationObject };
