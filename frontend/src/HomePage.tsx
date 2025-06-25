// import des bibliothèques
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
// import des composants
import SwiperContainer from "./components/common/swiper/SwiperContainer";
import ButtonComponent from "./components/common/button/ButtonComponent";
import ItemFilterComponent from "./components/common/itemFilter/ItemFilterComponent";
// import des services
import { getAllTagsWithMapsAndStorymaps } from "./utils/api/builtMap/getRequests";
import { getTranslations } from "./utils/api/translationAPI";
// import des custom hooks
import { useTranslation } from "./utils/hooks/useTranslation";
// import des types
import type { TagWithItemsType } from "./utils/types/commonTypes";
// import du style
import "./App.scss";
import style from "./HomePage.module.scss";
// import des icônes
import { ChevronRight } from "lucide-react";

type CheckboxType = { map: boolean; storymap: boolean };

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

	const [itemTypes, setItemTypes] = useState<CheckboxType>({
		map: true,
		storymap: true,
	});

	const [allTagsWithItems, setAllTagsWithItems] = useState<TagWithItemsType[]>(
		[],
	);

	useEffect(() => {
		const fetchAllTagsWithMapsAndStorymaps = async (
			itemTypes: CheckboxType,
		) => {
			const fetchedTags: TagWithItemsType[] =
				await getAllTagsWithMapsAndStorymaps(itemTypes);

			const sortedTags = fetchedTags.sort((a, b) => {
				const mapsNbA = a.maps ? a.maps.length : 0;
				const mapsNbB = b.maps ? b.maps.length : 0;
				const storymapsNbA = a.storymaps ? a.storymaps.length : 0;
				const storymapsNbB = b.storymaps ? b.storymaps.length : 0;
				return mapsNbB + storymapsNbB - (mapsNbA + storymapsNbA);
			});
			setAllTagsWithItems(sortedTags);
		};

		fetchAllTagsWithMapsAndStorymaps(itemTypes);
	}, [itemTypes]);

	const [translationTitle, setTranslationTitle] = useState<string>("");
	const [translationDescription, setTranslationDescription] =
		useState<string>("");
	useEffect(() => {
		const fetchDatabaseTranslation = async () => {
			const title = await getTranslations("homepage.atitle");
			setTranslationTitle(title[language]);
			const description = await getTranslations("homepage.description");
			setTranslationDescription(description[language]);
		};
		fetchDatabaseTranslation();
	}, [language]);

	const handleCheckboxChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
		type: "map" | "storymap",
	) => {
		const otherType = type === "map" ? "storymap" : "map";
		if (!e.target.checked && !itemTypes[otherType]) {
			setItemTypes({
				[otherType]: true,
				[type]: e.target.checked,
			} as CheckboxType);
			return;
		}
		setItemTypes((prev) => ({
			...prev,
			[type]: e.target.checked,
		}));
	};

	return (
		<section className={style.mainPage}>
			<section className={style.heroContainer}>
				<h1>{translationTitle}</h1>
				<p>{translationDescription}</p>
				<div className={style.heroButtonContainer}>
					<ButtonComponent
						type="route"
						color="brown"
						textContent="Explorer"
						link="/map/exploration"
					/>
					<ButtonComponent
						type="button"
						color="brown"
						textContent="Découvrir"
						onClickFunction={scrollToTagContainer}
					/>
				</div>
			</section>
			<section className={style.tagContainer} ref={tagContainerRef}>
				<ItemFilterComponent
					itemTypes={itemTypes}
					handleCheckboxChange={handleCheckboxChange}
				/>
				<div>
					{allTagsWithItems?.map((tagWithItems) => {
						const itemsArray =
							tagWithItems.maps && tagWithItems.storymaps
								? tagWithItems.maps.concat(tagWithItems.storymaps).slice(0, 3)
								: tagWithItems.maps || tagWithItems.storymaps || [];
						return (
							itemsArray.length > 0 && (
								<div key={tagWithItems.id} className={style.tagItemContainer}>
									<div className={style.tagItemContainerTitle}>
										<h3>{tagWithItems[`name_${language}`]}</h3>
										<Link to={`/tag/${tagWithItems.slug}`}>
											<div className={style.textButtonContainer}>
												{translation[language].button.seeAll} <ChevronRight />
											</div>
										</Link>
									</div>
									<SwiperContainer items={itemsArray} />
								</div>
							)
						);
					})}
				</div>
			</section>
		</section>
	);
}

export default HomePage;
