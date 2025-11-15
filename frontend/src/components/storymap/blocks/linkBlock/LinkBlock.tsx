// import des bibliothèques
import DOMPurify from "dompurify";
import { SquareArrowOutUpRight } from "lucide-react";
import { useMemo } from "react";
// import des custom hooks
import { Link } from "react-router";
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./linkBlock.module.scss";
// import des icônes

interface LinkBlockProps {
  blockContent: BlockContentType;
}

const LinkBlock = ({ blockContent }: LinkBlockProps) => {
  // récupération des données des stores
  const { selectedLanguage } = useStorymapLanguageStore();

  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(
      blockContent[`content1_${selectedLanguage}`] || ""
    );
  }, [blockContent, selectedLanguage]);

  return (
    <div className={style.linkBlockContent}>
      <Link
        to={blockContent[`content2_${selectedLanguage}`]}
        className={style.linkBlock}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
        <SquareArrowOutUpRight width={35} />
      </Link>
    </div>
  );
};

export default LinkBlock;
