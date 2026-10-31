// import des bibliothèques
import DOMPurify from "dompurify";
import { useMemo } from "react";
// import des custom hooks
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
import { getAllowedTags } from "../../../../utils/functions/block";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./quoteBlock.module.scss";
import "quill/dist/quill.snow.css";

interface QuoteBlockProps {
  blockContent: BlockContentType;
}

const QuoteBlock = ({ blockContent }: QuoteBlockProps) => {
  // import des données des stores
  const { selectedLanguage } = useStorymapLanguageStore();

  const sanitizedContent1 = useMemo(() => {
    return DOMPurify.sanitize(
      blockContent[`content1_${selectedLanguage}`] || "",
      getAllowedTags()
    );
  }, [blockContent, selectedLanguage]);

  const sanitizedContent2 = useMemo(() => {
    return DOMPurify.sanitize(
      blockContent[`content2_${selectedLanguage}`] || "",
      getAllowedTags()
    );
  }, [blockContent, selectedLanguage]);

  return (
    <div className={style.quoteBlockContainer}>
      <div // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
        dangerouslySetInnerHTML={{ __html: sanitizedContent1 }}
        className={`ql-editor ${style.quote}`} // permet d'avoir le style de Quill
      />
      <div // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
        dangerouslySetInnerHTML={{ __html: sanitizedContent2 }}
        className={`ql-editor ${style.source}`} // permet d'avoir le style de Quill
      />
    </div>
  );
};

export default QuoteBlock;
