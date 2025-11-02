// import des bibiliothèques
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";
// import des composants
import ButtonComponent from "../../../../components/common/button/ButtonComponent";
import { StorymapPageHelmetContent } from "../../../../components/helmet/HelmetContent";
import ComparisonMapBlock from "../../../../components/storymap/blocks/comparisonMapBlock/ComparisonMapBlock";
import EditableBlockWrapper from "../../../../components/storymap/blocks/EditableBlockWrapper";
import ImageBlock from "../../../../components/storymap/blocks/imageBlock/ImageBlock";
import ItemLinkBlock from "../../../../components/storymap/blocks/itemLinkBlock/ItemLinkBlock";
import LayoutBlock from "../../../../components/storymap/blocks/layoutBlock/LayoutBlock";
import LinkBlock from "../../../../components/storymap/blocks/linkBlock/LinkBlock";
import QuoteBlock from "../../../../components/storymap/blocks/quoteBlock/QuoteBlock";
import ScrolledMapBlock from "../../../../components/storymap/blocks/scrolledMapBlock/ScrolledMapBlock";
import SeparatorBlock from "../../../../components/storymap/blocks/separatorBlock/SeparatorBlock";
import SimpleMapBlock from "../../../../components/storymap/blocks/simpleMapBlock/SimpleMapBlock";
import StorymapConclusion from "../../../../components/storymap/blocks/storymapConclusion/StorymapConclusion";
import StorymapIntroduction from "../../../../components/storymap/blocks/storymapIntroduction/StorymapIntroduction";
import TableBlock from "../../../../components/storymap/blocks/tableBlock/TableBlock";
import TextBlock from "../../../../components/storymap/blocks/textBlock/TextBlock";
import TitleBlock from "../../../../components/storymap/blocks/titleBlock/TitleBlock";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import {
  getStorymapInfosAndBlocksById,
  getStorymapInfosAndBlocksBySlug,
} from "../../../../utils/api/storymap/getRequests";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useStorymapLanguageStore } from "../../../../utils/stores/storymap/storymapLanguageStore";
// import des types
import type {
  BlockContentType,
  StorymapType,
} from "../../../../utils/types/storymapTypes";
// import du style
import "quill/dist/quill.snow.css";
import style from "./storymapPage.module.scss";

export const getBlockComponentFromType = (
  block: BlockContentType,
  index: number,
  isPreview: boolean = false,
  storymapId?: string
) => {
  const key = block.position || index;
  switch (block.type.name) {
    case "title":
      return (
        <EditableBlockWrapper
          key={key}
          block={block}
          storymapId={storymapId}
          isPreview={isPreview}
        >
          <TitleBlock blockContent={block} />
        </EditableBlockWrapper>
      );
    case "subtitle":
      return (
        <EditableBlockWrapper
          key={key}
          block={block}
          storymapId={storymapId}
          isPreview={isPreview}
        >
          <TitleBlock blockContent={block} />
        </EditableBlockWrapper>
      );
    case "text":
      return (
        <EditableBlockWrapper
          key={key}
          block={block}
          storymapId={storymapId}
          isPreview={isPreview}
        >
          <TextBlock blockContent={block} />
        </EditableBlockWrapper>
      );
    case "image":
      return (
        <EditableBlockWrapper
          key={key}
          block={block}
          storymapId={storymapId}
          isPreview={isPreview}
        >
          <ImageBlock blockContent={block} />
        </EditableBlockWrapper>
      );
    case "link":
      return (
        <EditableBlockWrapper
          key={key}
          block={block}
          storymapId={storymapId}
          isPreview={isPreview}
        >
          <LinkBlock blockContent={block} />
        </EditableBlockWrapper>
      );
    case "itemLink":
      return (
        <EditableBlockWrapper
          key={key}
          block={block}
          storymapId={`${storymapId}`}
          isPreview={isPreview}
        >
          <ItemLinkBlock blockContent={block} />
        </EditableBlockWrapper>
      );
    case "separator":
      return <SeparatorBlock />;
    case "quote":
      return (
        <EditableBlockWrapper
          key={key}
          block={block}
          storymapId={storymapId}
          isPreview={isPreview}
        >
          <QuoteBlock blockContent={block} />
        </EditableBlockWrapper>
      );
    case "layout":
      return (
        <EditableBlockWrapper
          key={key}
          block={block}
          storymapId={`${storymapId}`}
          isPreview={isPreview}
        >
          <LayoutBlock blockContent={block} />
        </EditableBlockWrapper>
      );
    case "table":
      return (
        <EditableBlockWrapper
          key={key}
          block={block}
          storymapId={`${storymapId}`}
          isPreview={isPreview}
        >
          <TableBlock blockContent={block} />
        </EditableBlockWrapper>
      );
    case "simple_map": {
      const mapName = `simple-map-${uuidv4()}`;
      return (
        <EditableBlockWrapper
          key={key}
          block={block}
          storymapId={storymapId}
          isPreview={isPreview}
        >
          <SimpleMapBlock blockContent={block} mapName={mapName} />
        </EditableBlockWrapper>
      );
    }
    case "comparison_map": {
      const mapName = `comparison-map-${uuidv4()}`;
      return (
        <EditableBlockWrapper
          key={key}
          block={block}
          storymapId={storymapId}
          isPreview={isPreview}
        >
          <ComparisonMapBlock blockContent={block} mapName={mapName} />
        </EditableBlockWrapper>
      );
    }
    case "scroll_map": {
      const mapName = `map-${uuidv4()}`;
      return (
        <EditableBlockWrapper
          key={key}
          block={block}
          storymapId={storymapId}
          isPreview={isPreview}
        >
          <ScrolledMapBlock blockContent={block} mapName={mapName} />
        </EditableBlockWrapper>
      );
    }
    default:
      console.error(`Unsupported block type: ${block.type}`);
      return null;
  }
};

const StorymapPage = () => {
  const { translation, language } = useTranslation();

  // récupération de l'id de la storymap
  const { storymapSlug, storymapId } = useParams();

  // récupération de l'url
  const location = useLocation();

  // récupération des données des stores
  const { hasGrayScale, setHasGrayScale } = useMapStore();
  const { selectedLanguage, setSelectedLanguage } = useStorymapLanguageStore();

  // déclaration d'un état pour stocker les informations de la storymap
  const [storymapInfos, setStorymapInfos] = useState<StorymapType | null>(null);

  // détection du mode preview
  const isPreview = location.pathname.includes("storymaps/preview/");

  // au montage du composant, récupération des informations de la storymap
  useEffect(() => {
    const fetchStorymapInfos = async () => {
      if (storymapSlug) {
        const response = await getStorymapInfosAndBlocksBySlug(
          storymapSlug as string
        );
        setStorymapInfos(response);
      }
      if (storymapId) {
        const response = await getStorymapInfosAndBlocksById(
          storymapId as string
        );
        setStorymapInfos(response);
      }
    };
    fetchStorymapInfos();
  }, [storymapSlug, storymapId]);

  // restauration de la position de scroll au retour depuis le backoffice
  useEffect(() => {
    if (storymapInfos && isPreview) {
      const savedPosition = sessionStorage.getItem(
        `storymap_scroll_position_${storymapInfos.id}`
      );
      if (savedPosition) {
        // Petit délai pour s'assurer que tout le contenu est rendu
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedPosition),
            behavior: "smooth",
          });
          sessionStorage.removeItem(
            `storymap_scroll_position_${storymapInfos.id}`
          );
        }, 150);
      }
    }
  }, [storymapInfos, isPreview]);

  return (
    storymapInfos && (
      <>
        <StorymapPageHelmetContent
          storymapName={storymapInfos.title_lang1 as string}
        />
        <div className={style.storymapHeaderContainer}>
          {location.pathname.includes("storymaps/preview/") && (
            <div>
              <Link
                to={`/backoffice/storymaps/${storymapInfos.id}`}
                state={{ from: location.pathname }}
              >
                <ButtonComponent
                  type="button"
                  textContent={
                    translation[language].backoffice.storymapFormPage.backToEdit
                  }
                  color="gold"
                />
              </Link>
            </div>
          )}
          <div className={style.linkAndLanguageContainer}>
            {storymapInfos.lang2?.name && (
              <ul className={style.languageSelectionContainer}>
                <li
                  onClick={() => setSelectedLanguage("lang1")}
                  onKeyUp={() => setSelectedLanguage("lang1")}
                  style={
                    selectedLanguage === "lang1" ? { fontWeight: "bold" } : {}
                  }
                >
                  {storymapInfos.lang1.name.toUpperCase()}
                </li>
                <li
                  onClick={() => setSelectedLanguage("lang2")}
                  onKeyUp={() => setSelectedLanguage("lang2")}
                  style={
                    selectedLanguage === "lang2" ? { fontWeight: "bold" } : {}
                  }
                >
                  {storymapInfos.lang2.name.toUpperCase()}
                </li>
              </ul>
            )}
          </div>
          <div className={style.grayScaleToggleContainer}>
            <input
              type="checkbox"
              id="grayScaleToggle"
              onChange={() => setHasGrayScale(!hasGrayScale)}
              checked={hasGrayScale}
            />
            <label htmlFor="grayScaleToggle">
              {translation[language].button.grey}
            </label>
          </div>
        </div>
        <section className={style.storymapContainer}>
          <StorymapIntroduction
            introductionContent={storymapInfos as StorymapType}
          />
          {storymapInfos.blocks &&
            (storymapInfos.blocks as BlockContentType[]).map((block, index) =>
              getBlockComponentFromType(
                block,
                index,
                isPreview,
                storymapInfos.id
              )
            )}
          <StorymapConclusion storymapInfos={storymapInfos} />
        </section>
      </>
    )
  );
};

export default StorymapPage;
