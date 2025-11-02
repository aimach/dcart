// import des custom hooks
import { Link } from "react-router";
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./linkBlock.module.scss";
// import des icônes
import { SquareArrowOutUpRight } from "lucide-react";

interface LinkBlockProps {
  blockContent: BlockContentType;
}

const LinkBlock = ({ blockContent }: LinkBlockProps) => {
  // récupération des données des stores
  const { selectedLanguage } = useStorymapLanguageStore();

  return (
    <div className={style.linkBlockContent}>
      <Link
        to={blockContent[`content2_${selectedLanguage}`]}
        className={style.linkBlock}
        target="_blank"
        rel="noopener noreferrer"
      >
        {blockContent[`content1_${selectedLanguage}`]}
        <SquareArrowOutUpRight width={35} />
      </Link>
    </div>
  );
};

export default LinkBlock;
