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

const ImageBlock = ({ blockContent }: ImageBlockProps) => {
  // récupération des données des stores
  const { selectedLanguage } = useStorymapLanguageStore();

  const sanitizedCaption = useMemo(() => {
    return DOMPurify.sanitize(
      blockContent[`content2_${selectedLanguage}`] || ""
    );
  }, [blockContent, selectedLanguage]);

  return (
    <section className={style.imageSection}>
      <img
        src={blockContent[`content1_${selectedLanguage}`]}
        alt={blockContent[`content2_${selectedLanguage}`]}
        loading="lazy"
      />
      <p // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
        dangerouslySetInnerHTML={{
          __html: sanitizedCaption,
        }}
      />
    </section>
  );
};

export default ImageBlock;
