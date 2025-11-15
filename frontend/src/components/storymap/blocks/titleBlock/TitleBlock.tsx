// import des bibliothèques
import DOMPurify from "dompurify";
import { useMemo } from "react";
// import des custom hooks
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./titleBlock.module.scss";

interface TitleBlockProps {
  blockContent: BlockContentType;
}

const TitleBlock = ({ blockContent }: TitleBlockProps) => {
  // récupération des données des stores
  const { selectedLanguage } = useStorymapLanguageStore();

  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(
      blockContent[`content1_${selectedLanguage}`] || ""
    );
  }, [blockContent, selectedLanguage]);

  return (
    <section className={style.titleSection}>
      {blockContent.type.name === "title" ? (
        <h3 // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
          className={style.titleStyle}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      ) : (
        <h4 // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
          className={style.subtitleStyle}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      )}
    </section>
  );
};

export default TitleBlock;
