// import des bibliothèques
import DOMPurify from "dompurify";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
// import des composants
import ImageWithLink from "../common/ImageWithLink";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
// import des services
import { getAllTagsWithMapsAndStorymaps } from "../../utils/api/builtMap/getRequests";
import { getTranslations } from "../../utils/api/translationAPI";
import { shuffleArray } from "../../utils/functions/common";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { TagWithItemsType } from "../../utils/types/commonTypes";
// import du style
import style from "./appMenuComponent.module.scss";
// import des icones et images
import { ChevronRightCircle, CircleX } from "lucide-react";
import HNLogo from "../../assets/huma_num_logo.png";
import plhLogo from "../../assets/logo-PLH.jpg";
import labexLogo from "../../assets/logo_SMS.png";
import mapLogo from "../../assets/map_logo.png";
import ut2jLogo from "../../assets/ut2j_logo.png";

interface AppMenuComponentProps {
  setMenuIsOpen: Dispatch<SetStateAction<boolean>>;
}

/**
 * Composant du menu de l'application
 * @param {Object} props - Les propriétés du composant
 * @param {Function} props.setMenuIsOpen - La fonction pour ouvrir/fermer le menu
 * @returns ImageWithLink
 */
const AppMenuComponent = ({ setMenuIsOpen }: AppMenuComponentProps) => {
  // import des données de traduction
  const { language, translation } = useTranslation();

  const { isDesktop } = useWindowSize();

  const navigate = useNavigate();

  const [textContent, setTextContent] = useState<string>("");
  useEffect(() => {
    const fetchDatabaseTranslation = async () => {
      const title = await getTranslations("menu.description");
      setTextContent(title[language]);
    };
    fetchDatabaseTranslation();
  }, [language]);

  const sanitizedTextContent = useMemo(() => {
    return DOMPurify.sanitize(textContent || "");
  }, [textContent]);

  const [tags, setTags] = useState<TagWithItemsType[]>([]);
  useEffect(() => {
    const fetchAllTags = async () => {
      const { items } = await getAllTagsWithMapsAndStorymaps(
        {
          map: true,
          storymap: true,
        },
        "",
        []
      );
      const slicedTags = shuffleArray(items).slice(0, 5); // Limiter à 5 tags
      setTags(slicedTags);
    };
    fetchAllTags();
  }, []);

  const closeMenuAndNavigate = (path: string) => {
    setMenuIsOpen(false);
    navigate(path);
  };

  const currentYear = new Date().getFullYear();

  return (
    <main className={style.menuPageContainer}>
      <section className={style.menuPageMenuSection}>
        {!isDesktop && <CircleX onClick={() => setMenuIsOpen(false)} />}
        <nav className={style.menuPageMenu}>
          <ul>
            <li
              onClick={() => closeMenuAndNavigate("/map/exploration")}
              onKeyUp={() => closeMenuAndNavigate("/map/exploration")}
            >
              <ChevronRightCircle />
              {translation[language].navigation.explore}
            </li>
            {tags.map((tag) => {
              if (tag.maps.length > 0 || tag.storymaps.length > 0) {
                return (
                  <li
                    key={tag.id}
                    onClick={() => closeMenuAndNavigate(`/tag/${tag.slug}`)}
                    onKeyUp={() => closeMenuAndNavigate(`/tag/${tag.slug}`)}
                  >
                    <ChevronRightCircle />
                    {tag[`name_${language}`]}
                  </li>
                );
              }
            })}
          </ul>
        </nav>
        <p
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
          dangerouslySetInnerHTML={{ __html: sanitizedTextContent }}
          className="ql-editor"
        />
        <section className={style.menuPageLogoSection}>
          <ImageWithLink
            type="link"
            link="https://sms.univ-tlse2.fr/"
            imgSrc={labexLogo}
            imgAlt="labex logo"
            imgWidth={isDesktop ? 100 : 70}
          />
          <ImageWithLink
            type="link"
            link="https://www.huma-num.fr/"
            imgSrc={HNLogo}
            imgAlt="huma-num logo"
            imgWidth={isDesktop ? 100 : 70}
          />
          <ImageWithLink
            type="link"
            link="https://base-map-polytheisms.huma-num.fr/"
            imgSrc={mapLogo}
            imgAlt="bdd map logo"
            imgWidth={isDesktop ? 100 : 70}
          />
          <ImageWithLink
            type="link"
            link="https://www.univ-tlse2.fr/"
            imgSrc={ut2jLogo}
            imgAlt="ut2j logo"
            imgWidth={isDesktop ? 100 : 70}
          />
          <ImageWithLink
            type="link"
            link="https://plh.univ-tlse2.fr/"
            imgSrc={plhLogo}
            imgAlt="plh logo"
            imgWidth={isDesktop ? 100 : 70}
          />
        </section>
        <section className={style.legalPageSection}>
          <Link to="/mentions-legales" onClick={() => setMenuIsOpen(false)}>
            {translation[language].navigation.legalNotice}
          </Link>
        </section>
        <p>
          © {currentYear} Projet dCART.{" "}
          {translation[language].allRightsReserved}.
        </p>
      </section>
      {isDesktop && (
        <section className={style.menuPageImageSection}>
          <CircleX onClick={() => setMenuIsOpen(false)} />
        </section>
      )}
    </main>
  );
};

export default AppMenuComponent;
