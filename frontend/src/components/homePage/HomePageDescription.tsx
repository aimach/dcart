import DOMPurify from "dompurify";
import { useMemo } from "react";
import useHomePageTranslations from "../../utils/hooks/useHomepageTranslations";
import style from "./HomePage.module.scss";

function HomePageDescription() {
  const { translationDescription } = useHomePageTranslations();

  const sanitizedDescription = useMemo(() => {
    return DOMPurify.sanitize(translationDescription || "");
  }, [translationDescription]);

  return (
    <div
      // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
      dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      className={style.homePageDescription}
    />
  );
}

export default HomePageDescription;
