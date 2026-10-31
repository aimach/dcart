// import des bibliothèques
import DOMPurify from "dompurify";
import { SquareArrowOutUpRight } from "lucide-react";
import { useMemo } from "react";
// import des custom hooks
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
// import du style
import style from "./linkBlock.module.scss";
// import des icônes

interface LinkBlockProps {
  blockContent: BlockContentType;
}

/**
 * Récupère une URL absolue à partir du contenu du champ lien.
 * Les liens saisis avec l'éditeur wysiwyg sont stockés en HTML : on récupère
 * alors le href de la première balise <a>, ou à défaut le texte brut.
 */
const getLinkUrl = (rawLink: string | null | undefined): string => {
  if (!rawLink) return "";
  const doc = new DOMParser().parseFromString(rawLink, "text/html");
  const url = (
    doc.querySelector("a")?.getAttribute("href") ||
    doc.body.textContent ||
    ""
  ).trim();
  if (!url) return "";
  if (/^(https?:|mailto:)/i.test(url)) return url;
  // autre protocole (ex : javascript:) : lien refusé
  if (/^[a-z][a-z\d+.-]*:/i.test(url) && !/^[^:]+:\d/.test(url)) return "";
  // sans protocole, le navigateur traiterait le lien comme un chemin relatif
  return `https://${url}`;
};

const LinkBlock = ({ blockContent }: LinkBlockProps) => {
  // récupération des données des stores
  const { selectedLanguage } = useStorymapLanguageStore();

  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(
      blockContent[`content1_${selectedLanguage}`] || ""
    );
  }, [blockContent, selectedLanguage]);

  // le lien n'est saisi qu'une seule fois, en langue 1
  const linkUrl = useMemo(
    () => getLinkUrl(blockContent.content2_lang1),
    [blockContent]
  );

  return (
    <div className={style.linkBlockContent}>
      <a
        href={linkUrl}
        className={style.linkBlock}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
        <SquareArrowOutUpRight width={35} />
      </a>
    </div>
  );
};

export default LinkBlock;
