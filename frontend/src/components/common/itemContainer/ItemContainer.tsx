// import des bibliothèques
import DOMPurify from "dompurify";
import { useMemo } from "react";
import { Link } from "react-router";
// import des composants
import TagListComponent from "../tagList/TagListComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { isMapType } from "../../../utils/types/mapTypes";
// import des types
import type { TagWithItemsType } from "../../../utils/types/commonTypes";
import type { MapInfoType } from "../../../utils/types/mapTypes";
// import du style
import style from "./itemContainer.module.scss";
// import des icônes et images
import { BookOpenText, MapPin } from "lucide-react";
import mapPinBG from "../../../assets/pin-bg.png";
import bookOpenBG from "../../../assets/sm-bg.png";

type ItemContainerProps = {
  item:
    | TagWithItemsType["maps"][number] // sélectionne le type des items de "maps" de TagWithItemsType
    | TagWithItemsType["storymaps"][number] // sélectionne le type des items de "storymaps" de TagWithItemsType;
    | MapInfoType;
};

const ItemContainer = ({ item }: ItemContainerProps) => {
  const { language } = useTranslation();
  const isMap = isMapType(item);
  const imageUrl = (item.image_url as string)?.includes("/media/original/")
    ? (item.image_url as string).replace("/media/original/", "/media/thumb/")
    : (item.image_url as string);
  const backgroudImage = imageUrl ? imageUrl : isMap ? mapPinBG : bookOpenBG;

  const sanitizedTitle = useMemo(() => {
    const title = isMap
      ? item[`title_${language}`]
      : (item as TagWithItemsType["storymaps"][number]).title_lang1;
    return DOMPurify.sanitize(title || "");
  }, [item, language, isMap]);

  return (
    <Link
      to={
        isMap
          ? `/map/${item.slug}`
          : `/storymap/${(item as TagWithItemsType["storymaps"][number]).slug}`
      }
    >
      <div className={style.itemIcon}>
        {isMap ? <MapPin /> : <BookOpenText />}
      </div>
      <div
        className={style.itemSwiper}
        style={{
          backgroundImage: `url(${backgroudImage})`,
        }}
      >
        <div className={style.itemText}>
          <h3 // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
            dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
          />
          <TagListComponent item={item} withLink={false} />
        </div>
      </div>
    </Link>
  );
};

export default ItemContainer;
