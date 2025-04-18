// import des bibliothèques
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
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
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
// import des icônes et images
import { BookOpenText, MapPin } from "lucide-react";
import mapPinBG from "../../../assets/map-pin-bg.png";
import bookOpenBG from "../../../assets/book-open-bg.png";

type SwiperContainerProps = {
	items: (
		| TagWithItemsType["maps"][number] // sélectionne le type des items de "maps" de TagWithItemsType
		| TagWithItemsType["storymaps"][number] // sélectionne le type des items de "storymaps" de TagWithItemsType
	)[];
};

const SwiperContainer = ({ items }: SwiperContainerProps) => {
	const { language } = useTranslation();

	return (
		<Swiper
			slidesPerView={3}
			spaceBetween={30}
			pagination={{
				clickable: true,
			}}
			modules={[Pagination, Navigation, Autoplay]}
			className={style.itemSwiperContainer}
		>
			{items.map((item) => {
				const isMap = isMapType(item);
				const backgroudImage = item.image_url
					? item.image_url
					: isMap
						? mapPinBG
						: bookOpenBG;

				return (
					<SwiperSlide key={item.id} className={style.itemSwiperSlide}>
						<Link to={isMap ? `/map/${item.id}` : `/storymap/${item.id}`}>
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
		</Swiper>
	);
};

export default SwiperContainer;
