// import des bibliothèques
import { Link } from "react-router";
import { SwiperSlide } from "swiper/react";
// import des composants
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { isMapType } from "../../../utils/types/mapTypes";
// import des types
import type { TagType } from "../../../utils/types/storymapTypes";
import type { TagWithItemsType } from "../../../utils/types/commonTypes";
// import du style
import style from "./swiper.module.scss";
import "./swiper.css";
// import des icônes et des images
import { BookOpenText, MapPin } from "lucide-react";
import mapPinBG from "../../../assets/map-pin-bg.png";
import bookOpenBG from "../../../assets/book-open-bg.png";

type SwiperHomePageProps = {
	items: (
		| TagWithItemsType["maps"][number] // sélectionne le type des items de "maps" de TagWithItemsType
		| TagWithItemsType["storymaps"][number] // sélectionne le type des items de "storymaps" de TagWithItemsType
	)[];
};

const SwiperHomePage = ({ items }: SwiperHomePageProps) => {
	const { language } = useTranslation();

	return (
		<>
			{items.map((item) => {
				const isMap = isMapType(item);
				const backgroudImage = item.image_url
					? item.image_url
					: isMap
						? mapPinBG
						: bookOpenBG;

				return (
					<SwiperSlide key={item.id} className={style.itemSwiperSlide}>
						<Link to={isMap ? `/map/${item.slug}` : `/storymap/${item.slug}`}>
							<div
								className={style.itemSwiper}
								style={{
									backgroundImage: `url(${backgroudImage})`,
								}}
							>
								<div className={style.itemIcon}>
									{isMap ? <MapPin /> : <BookOpenText />}
								</div>
								<div className={style.itemText}>
									<h4>
										{isMap ? item[`title_${language}`] : item.title_lang1}
									</h4>
									<div className={style.itemTags}>
										{item.tags.map((tag: TagType) => (
											<p key={tag.id}>#{tag[`name_${language}`]}</p>
										))}
									</div>
								</div>
							</div>
						</Link>
					</SwiperSlide>
				);
			})}
		</>
	);
};

export default SwiperHomePage;
