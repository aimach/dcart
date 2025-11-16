// import des bibliothèques
import DOMPurify from "dompurify";
import { useMemo } from "react";
// import des services
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { StorymapType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./storymapIntroduction.module.scss";

interface StorymapIntroductionProps {
  introductionContent: StorymapType;
}

const StorymapIntroduction = ({
  introductionContent,
}: StorymapIntroductionProps) => {
  // récupération des données des stores
  const { selectedLanguage } = useStorymapLanguageStore();

  const sanitizedTitle = useMemo(() => {
    return DOMPurify.sanitize(
      introductionContent[`title_${selectedLanguage}`] || ""
    );
  }, [introductionContent, selectedLanguage]);

  const sanitizedDescription = useMemo(() => {
    return DOMPurify.sanitize(
      introductionContent[`description_${selectedLanguage}`] || ""
    );
  }, [introductionContent, selectedLanguage]);

  const sanitizedAuthor = useMemo(() => {
    return introductionContent.author
      ? DOMPurify.sanitize(introductionContent.author)
      : null;
  }, [introductionContent.author]);

  const sanitizedAuthorStatus = useMemo(() => {
    return introductionContent.author_status
      ? DOMPurify.sanitize(introductionContent.author_status)
      : null;
  }, [introductionContent.author_status]);

  const sanitizedPublishedAt = useMemo(() => {
    return introductionContent.publishedAt
      ? DOMPurify.sanitize(introductionContent.publishedAt)
      : null;
  }, [introductionContent.publishedAt]);

  const backgroundStyle = introductionContent.image_url
    ? {
        backgroundImage: `url(${introductionContent.image_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        backgroundColor: introductionContent.background_color || "#f0f0f0",
      };

  return (
    <section className={style.introductionContainer} style={backgroundStyle}>
      <div className={style.contentContainer}>
        <h2 // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
          dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
        />
        <p // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
        <div className={style.authorAndDateContainer}>
          {sanitizedAuthor && (
            <p // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
              dangerouslySetInnerHTML={{ __html: sanitizedAuthor }}
            />
          )}
          {sanitizedAuthorStatus && (
            <p // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
              dangerouslySetInnerHTML={{ __html: sanitizedAuthorStatus }}
            />
          )}
          {sanitizedPublishedAt && (
            <p // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
              dangerouslySetInnerHTML={{ __html: sanitizedPublishedAt }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default StorymapIntroduction;
