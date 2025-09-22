// import des bibliothèques
import { useEffect, useState } from "react";
// import des custom hooks
import { useTranslation } from "./useTranslation";
// import des services
import { getTranslations } from "../api/translationAPI";

const useHomePageTranslations = () => {
  const { language } = useTranslation();
  const [translationTitle, setTranslationTitle] = useState<string>("");
  const [translationDescription, setTranslationDescription] =
    useState<string>("");
  useEffect(() => {
    const fetchDatabaseTranslation = async () => {
      const title = await getTranslations("homepage.atitle");
      setTranslationTitle(title[language]);
      const description = await getTranslations("homepage.description");
      setTranslationDescription(description[language]);
    };
    fetchDatabaseTranslation();
  }, [language]);

  return { translationTitle, translationDescription };
};

export default useHomePageTranslations;
