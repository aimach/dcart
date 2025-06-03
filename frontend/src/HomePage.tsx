// import des bibliothèques
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
// import des composants
import SwiperContainer from "./components/common/swiper/SwiperContainer";
import ButtonComponent from "./components/common/button/ButtonComponent";
// import des services
import { getAllTagsWithMapsAndStorymaps } from "./utils/api/builtMap/getRequests";
import { shuffleArray } from "./utils/functions/common";
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

	const [databaseTranslation, setDatabaseTranslation] = useState<
		Record<string, string>[]
	>([]);

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

	useEffect(() => {
		const fetchDatabaseTranslation = async () => {
			const translations = await getTranslations();
			setDatabaseTranslation(translations);
		};
		fetchDatabaseTranslation();
	}, []);

	const homePageContent = useMemo(() => {
		if (databaseTranslation?.length > 0) {
			const translationObject = databaseTranslation.find(
				(translation) => translation.language === language,
			) as { translations: Record<string, string> } | undefined;
			return {
				title: translationObject?.translations["homepage.title"],
				description: translationObject?.translations["homepage.description"],
			};
		}
		return {
			title: translation[language].title,
			description: translation[language].homeDescription,
		};
	}, [databaseTranslation, translation, language]);

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
				<h1>{homePageContent.title}</h1>
				<p>{homePageContent.description}</p>
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
				<div className={style.filterContainer}>
					<div className={style.filterInputContainer}>
						<input
							type="checkbox"
							name="map"
							id="map"
							checked={itemTypes.map}
							onChange={(e) => handleCheckboxChange(e, "map")}
						/>
						<legend>{translation[language].common.map}s</legend>
					</div>
					<div className={style.filterInputContainer}>
						<input
							type="checkbox"
							name="storymap"
							id="storymap"
							checked={itemTypes.storymap}
							onChange={(e) => handleCheckboxChange(e, "storymap")}
						/>
						<legend>{translation[language].common.storymap}s</legend>
					</div>
				</div>
				<div>
					{allTagsWithItems?.map((tagWithItems) => {
						const itemsArray =
							tagWithItems.maps && tagWithItems.storymaps
								? tagWithItems.maps.concat(tagWithItems.storymaps)
								: tagWithItems.maps || tagWithItems.storymaps || [];
						const items = itemsArray.length > 0 ? shuffleArray(itemsArray) : [];
						return (
							items.length > 0 && (
								<div key={tagWithItems.id} className={style.tagItemContainer}>
									<div className={style.tagItemContainerTitle}>
										<h3>{tagWithItems[`name_${language}`]}</h3>
										<Link to={`/tag/${tagWithItems.slug}`}>
											<div className={style.textButtonContainer}>
												{translation[language].button.seeAll} <ChevronRight />
											</div>
										</Link>
									</div>
									<SwiperContainer items={items} />
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
