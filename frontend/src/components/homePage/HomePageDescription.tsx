import DOMPurify from "dompurify";
import "quill/dist/quill.snow.css";
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
      className={`${style.homePageDescription} ql-editor`}
    />
  );
}

export default HomePageDescription;
