// import des bibliothèques
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import des composants
import ItemContainer from "../itemContainer/ItemContainer";
// import des custom hooks
import { useWindowSize } from "../../../utils/hooks/useWindowSize";
// import des types
import type { TagWithItemsType } from "../../../utils/types/commonTypes";
// import du style
import style from "./swiper.module.scss";
import "./swiper.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

type SwiperContainerProps = {
	items: (
		| TagWithItemsType["maps"][number] // sélectionne le type des items de "maps" de TagWithItemsType
		| TagWithItemsType["storymaps"][number] // sélectionne le type des items de "storymaps" de TagWithItemsType
	)[];
};

const SwiperContainer = ({ items }: SwiperContainerProps) => {
	const { isMobile, isTablet } = useWindowSize();

	return (
		<Swiper
			slidesPerView={isMobile ? 1 : isTablet ? 2 : 3}
			spaceBetween={30}
			pagination={{
				clickable: true,
			}}
			modules={[Pagination, Navigation, Autoplay]}
			className={style.itemSwiperContainer}
			style={{
				"--swiper-pagination-color": "#4A3E31",
				"--swiper-pagination-bullet-inactive-color": "#AD9A85",
				"--swiper-pagination-bullet-size": "8px",
				"--swiper-pagination-bullet-horizontal-gap": "3px",
			}}
		>
			{items.map((item) => {
				return (
					<SwiperSlide key={item.id} className={style.itemSwiperSlide}>
						<ItemContainer item={item} />
					</SwiperSlide>
				);
			})}
		</Swiper>
	);
};

export default SwiperContainer;
