// import des bibliothèques
import { createContext, useState, useEffect } from "react";
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

const getBrowserLanguage = () => {
  const lang = navigator.language;
  if (lang.startsWith("fr")) return "fr";
  return "en"; // fallback
};

const translation = {
  en: translationEn,
  fr: translationFr,
};

export const TranslationContext = createContext<I18nContextType>({
  language: "en",
  setLanguage: () => {},
  translation: translation,
});

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const browserLanguage = getBrowserLanguage();
    if (browserLanguage) {
      setLanguage(browserLanguage as Language);
    }
  }, []);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translation }}>
      {children}
    </TranslationContext.Provider>
  );
};
