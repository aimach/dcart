// import des bibliothèques
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
// import des composants
import SwiperContainer from "./components/common/swiper/SwiperContainer";
import ButtonComponent from "./components/common/button/ButtonComponent";
// import des services
import { getAllTagsWithMapsAndStorymaps } from "./utils/api/builtMap/getRequests";
import { shuffleArray } from "./utils/functions/common";
// import des custom hooks
import { useTranslation } from "./utils/hooks/useTranslation";
// import des types
import type { TagWithItemsType } from "./utils/types/commonTypes";
// import du style
import style from "./App.module.scss";
// import des icônes
import { ChevronRight } from "lucide-react";

/**
 * Page d'accueil : titre, description et barre de navigation
 * @returns NavComponent
 */
function HomePage() {
	// récupération des données de traduction
	const { language, translation } = useTranslation();

	const tagContainerRef = useRef<HTMLDivElement | null>(null);

	const scrollToTagContainer = () => {
		tagContainerRef.current?.scrollIntoView({ behavior: "smooth" });
	};

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
			<section className={style.heroContainer}>
				<h1>{translation[language].title as string}</h1>
				<ButtonComponent
					type="button"
					color="brown"
					textContent="Découvrir"
					onClickFunction={scrollToTagContainer}
				/>
			</section>
			<section className={style.tagContainer} ref={tagContainerRef}>
				{allTagsWithItems.map((tagWithItems) => {
					const items = shuffleArray(
						tagWithItems.maps.concat(tagWithItems.storymaps),
					);
					return (
						items.length > 0 && (
							<div key={tagWithItems.id} className={style.tagItemContainer}>
								<h3>
									<Link to={`tag/${tagWithItems.id}`}>
										{tagWithItems[`name_${language}`]} <ChevronRight />
									</Link>
								</h3>
								<SwiperContainer items={items} />
							</div>
						)
					);
				})}
			</section>
		</section>
	);
}

export default HomePage;
