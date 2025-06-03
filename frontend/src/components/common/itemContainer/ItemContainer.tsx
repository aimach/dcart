// import des bibliothèques
import { Link } from "react-router";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { isMapType } from "../../../utils/types/mapTypes";
// import des types
import type { TagType } from "../../../utils/types/storymapTypes";
import type { TagWithItemsType } from "../../../utils/types/commonTypes";
// import du style
import style from "./itemContainer.module.scss";
// import des icônes et images
import { MapPin, BookOpenText } from "lucide-react";
import mapPinBG from "../../../assets/pin-bg.png";
import bookOpenBG from "../../../assets/sm-bg.png";

type ItemContainerProps = {
	item:
		| TagWithItemsType["maps"][number] // sélectionne le type des items de "maps" de TagWithItemsType
		| TagWithItemsType["storymaps"][number]; // sélectionne le type des items de "storymaps" de TagWithItemsType;
};

const ItemContainer = ({ item }: ItemContainerProps) => {
	const { language } = useTranslation();
	const isMap = isMapType(item);
	const backgroudImage = item.image_url
		? item.image_url
		: isMap
			? mapPinBG
			: bookOpenBG;

	return (
		<Link to={isMap ? `/map/${item.slug}` : `/storymap/${item.slug}`}>
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
					<h4>{isMap ? item[`title_${language}`] : item.title_lang1}</h4>
					<div className={style.itemTags}>
						{item.tags.slice(0, 3).map((tag: TagType) => (
							<p key={tag.id}>#{tag[`name_${language}`]}</p>
						))}
					</div>
				</div>
			</div>
		</Link>
	);
};

export default ItemContainer;
