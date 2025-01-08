// import des bibliothèques
import { createContext, useState } from "react";
import type { ReactNode } from "react";
// import des types
import type { Language } from "../types/languageTypes";
// import des fichiers
import translationFr from "../translations/translation-fr.json";
import translationEn from "../translations/translation-en.json";

export interface I18nContextType {
	language: Language;
	setLanguage: (language: Language) => void;
	translation: {
		[key: string]: { [key: string]: string };
	};
}

const translation = {
	en: translationEn,
	fr: translationFr,
};

export const TranslationContext = createContext<I18nContextType>({
	language: "fr",
	setLanguage: () => {},
	translation: translation,
});

interface TranslationProviderProps {
	children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
	const [language, setLanguage] = useState<Language>(
		(navigator.language.slice(0, 2) as Language) || "fr",
	);

	return (
		<TranslationContext.Provider value={{ language, setLanguage, translation }}>
			{children}
		</TranslationContext.Provider>
	);
};
