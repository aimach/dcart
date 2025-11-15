// import des bibliothèques
import DOMPurify from "dompurify";
import { useMemo } from "react";
// import des custom hooks
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./quoteBlock.module.scss";

interface QuoteBlockProps {
  blockContent: BlockContentType;
}

const QuoteBlock = ({ blockContent }: QuoteBlockProps) => {
  // import des données des stores
  const { selectedLanguage } = useStorymapLanguageStore();

  const sanitizedContent1 = useMemo(() => {
    return DOMPurify.sanitize(
      blockContent[`content1_${selectedLanguage}`] || ""
    );
  }, [blockContent, selectedLanguage]);

  const sanitizedContent2 = useMemo(() => {
    return DOMPurify.sanitize(
      blockContent[`content2_${selectedLanguage}`] || ""
    );
  }, [blockContent, selectedLanguage]);

  return (
    <div className={style.quoteBlockContainer}>
      <p // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
        dangerouslySetInnerHTML={{ __html: sanitizedContent1 }}
      />
      <p // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
        dangerouslySetInnerHTML={{ __html: sanitizedContent2 }}
      />
    </div>
  );
};

export default QuoteBlock;
