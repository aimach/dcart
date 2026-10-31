// import des bibliothèques
import DOMPurify from "dompurify";
import { useMemo } from "react";
// import des services
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
import { getCoverImageStyle } from "../../../../utils/functions/storymap";
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

  // sans image, la couleur de fond est appliquée au bloc
  const backgroundStyle = introductionContent.image_url
    ? {}
    : {
        backgroundColor: introductionContent.background_color || "#f0f0f0",
      };

  return (
    <section
      className={style.introductionContainer}
      style={backgroundStyle}
      // bloc pleine largeur : le sommaire est masqué par-dessus
      data-storymap-full-width
    >
      {introductionContent.image_url && (
        <div
          className={style.coverImage}
          style={getCoverImageStyle(
            introductionContent.image_url,
            introductionContent.image_zoom,
            introductionContent.image_position_x,
            introductionContent.image_position_y
          )}
        />
      )}
      <div
        className={`${style.contentContainer} ${
          introductionContent.transparent_title_block ? style.transparent : ""
        }`}
      >
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
