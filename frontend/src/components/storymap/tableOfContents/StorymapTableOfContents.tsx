// import des bibliothèques
import { useEffect, useMemo, useRef, useState } from "react";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
import { useStorymapLanguageStore } from "../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type { BlockContentType } from "../../../utils/types/storymapTypes";
// import du style
import style from "./storymapTableOfContents.module.scss";

interface StorymapTableOfContentsProps {
  blocks: BlockContentType[];
}

/**
 * Renvoie l'id de l'ancre d'un bloc titre, utilisée par le sommaire
 * @param blockId - L'id du bloc titre
 */
export const getTitleAnchorId = (blockId: string) => `storymap-title-${blockId}`;

// sélecteur des blocs pleine largeur (introduction, carte à défilement) que le sommaire ne doit pas recouvrir
export const FULL_WIDTH_BLOCK_ATTRIBUTE = "data-storymap-full-width";

// texte brut d'un titre stocké en HTML (wysiwyg)
const getPlainText = (html: string) =>
  new DOMParser().parseFromString(html, "text/html").body.textContent?.trim() ??
  "";

/**
 * Sommaire des titres et sous-titres de la storymap, fixé à gauche de l'écran
 */
const StorymapTableOfContents = ({ blocks }: StorymapTableOfContentsProps) => {
  const { translation, language } = useTranslation();
  const { selectedLanguage } = useStorymapLanguageStore();

  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(true);

  const titles = useMemo(
    () =>
      blocks
        .filter(
          (block) =>
            block.type.name === "title" || block.type.name === "subtitle"
        )
        .map((block) => ({
          id: block.id,
          isSubtitle: block.type.name === "subtitle",
          text: getPlainText(block[`content1_${selectedLanguage}`] || ""),
        }))
        .filter((title) => title.text),
    [blocks, selectedLanguage]
  );

  // au défilement : titre en cours de lecture et masquage au-dessus des blocs pleine largeur
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // titre actif : le dernier titre passé sous le tiers haut de l'écran
      let currentId: string | null = null;
      for (const title of titles) {
        const element = document.getElementById(getTitleAnchorId(title.id));
        if (
          element &&
          element.getBoundingClientRect().top <= window.innerHeight / 3
        ) {
          currentId = title.id;
        }
      }
      setActiveId(currentId);

      // masqué tant qu'un bloc pleine largeur occupe la même hauteur que le sommaire
      const navRect = navRef.current?.getBoundingClientRect();
      if (!navRect) return;
      const isOverlapping = Array.from(
        document.querySelectorAll(`[${FULL_WIDTH_BLOCK_ATTRIBUTE}]`)
      ).some((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top < navRect.bottom && rect.bottom > navRect.top;
      });
      setIsHidden(isOverlapping);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [titles]);

  // un sommaire d'une seule entrée n'aide pas à la navigation
  if (titles.length < 2) return null;

  return (
    <nav
      ref={navRef}
      className={`${style.tableOfContents} ${isHidden ? style.hidden : ""}`}
      aria-label={translation[language].common.tableOfContents}
    >
      <p className={style.tableOfContentsTitle}>
        {translation[language].common.tableOfContents}
      </p>
      <ul>
        {titles.map((title) => (
          <li
            key={title.id}
            className={`${title.isSubtitle ? style.subtitle : ""} ${
              activeId === title.id ? style.active : ""
            }`}
          >
            <button
              type="button"
              // le routeur utilise le hash de l'url : pas d'ancre classique
              onClick={() =>
                document
                  .getElementById(getTitleAnchorId(title.id))
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              aria-current={activeId === title.id ? "location" : undefined}
            >
              {title.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default StorymapTableOfContents;
