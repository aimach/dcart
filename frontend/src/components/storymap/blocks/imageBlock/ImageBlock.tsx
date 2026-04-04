// import des bibliothèques
import DOMPurify from "dompurify";
import { useMemo } from "react";
// import des custom hooks
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./imageBlock.module.scss";

interface ImageBlockProps {
  blockContent: BlockContentType;
}

/**
 * Convertit une URL d'image originale en URL medium
 * @param url - L'URL de l'image originale
 * @returns L'URL medium ou l'URL originale si elle n'est pas locale
 */
const getMediumImageUrl = (url: string | null | undefined): string => {
  if (!url || typeof url !== "string") {
    return "";
  }

  // Si c'est une URL locale, utiliser la version medium
  if (url.includes("/dcart/media/original/")) {
    return url.replace("/dcart/media/original/", "/dcart/media/medium/");
  }
  if (url.includes("/media/original/")) {
    return url.replace("/media/original/", "/media/medium/");
  }

  // Si c'est une URL externe, la retourner telle quelle
  return url;
};

const ImageBlock = ({ blockContent }: ImageBlockProps) => {
  // récupération des données des stores
  const { selectedLanguage } = useStorymapLanguageStore();

  const imageUrl = useMemo(
    () => getMediumImageUrl(blockContent[`content1_${selectedLanguage}`]),
    [blockContent, selectedLanguage]
  );

  const sanitizedCaption = useMemo(() => {
    return DOMPurify.sanitize(
      blockContent[`content2_${selectedLanguage}`] || ""
    );
  }, [blockContent, selectedLanguage]);

  return (
    <section className={style.imageSection}>
      <img
        src={imageUrl}
        alt={blockContent[`content2_${selectedLanguage}`] || ""}
        loading="lazy"
      />
      {sanitizedCaption && (
        <p // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
          dangerouslySetInnerHTML={{
            __html: sanitizedCaption,
          }}
        />
      )}
    </section>
  );
};

export default ImageBlock;
