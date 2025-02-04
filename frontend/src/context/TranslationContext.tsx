// import des bibliothèques
import { createContext, useState } from "react";
// import des types
import type { ReactNode } from "react";
import type { Language, TranslationType } from "../utils/types/languageTypes";
// import des fichiers
import translationFr from "../utils/translations/translation-fr.json";
import translationEn from "../utils/translations/translation-en.json";

export interface I18nContextType {
	language: Language;
	setLanguage: (language: Language) => void;
	translation: TranslationType;
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
