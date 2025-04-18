// import des bibliothèques
import { useEffect, useState } from "react";
// import des composants
import SwiperContainer from "./components/common/swiper/SwiperContainer";
import SwiperHomePage from "./components/common/swiper/SwiperHomePage";
// import des services
import { getAllTagsWithMapsAndStorymaps } from "./utils/api/builtMap/getRequests";
import { shuffleArray } from "./utils/functions/common";
// import des custom hooks
import { useTranslation } from "./utils/hooks/useTranslation";
// import des types
import type { TagWithItemsType } from "./utils/types/commonTypes";
// import du style
import style from "./App.module.scss";

/**
 * Page d'accueil : titre, description et barre de navigation
 * @returns NavComponent
 */
function HomePage() {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	const [allTagsWithItems, setAllTagsWithItems] = useState<TagWithItemsType[]>(
		[],
	);
	useEffect(() => {
		const fetchAllTagsWithMapsAndStorymaps = async () => {
			const fetchedTags = await getAllTagsWithMapsAndStorymaps();
			setAllTagsWithItems(fetchedTags);
		};

		fetchAllTagsWithMapsAndStorymaps();
	}, []);

	return (
		<section className={style.mainPage}>
			<h1>{translation[language].title as string}</h1>
			<div className={style.tagContainer}>
				{allTagsWithItems.map((tagWithItems) => {
					const items = shuffleArray(
						tagWithItems.maps.concat(tagWithItems.storymaps),
					);
					return <SwiperContainer key={tagWithItems.id} items={items} />;
				})}
			</div>
		</section>
	);
}

export default HomePage;
