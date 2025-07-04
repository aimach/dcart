// import des bibliothèques
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import Select from "react-select";
// import des composants
import SwiperContainer from "../common/swiper/SwiperContainer";
import ButtonComponent from "../common/button/ButtonComponent";
import ItemFilterComponent from "../common/itemFilter/ItemFilterComponent";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
import useHomePageTranslations from "../../utils/hooks/useHomepageTranslations";
import useInfiniteScroll from "../../utils/hooks/useInfiniteScroll";
// import des services
import {
	fetchAllTagsForSelectOption,
	fetchAllTagsWithMapsAndStorymaps,
	handleCheckboxChange,
	handleFilterInputs,
	isEmptyResult,
	scrollToTagContainer,
} from "../../utils/functions/homePage";
// import des types
import type {
	OptionType,
	PaginationObjectType,
	TagWithItemsType,
} from "../../utils/types/commonTypes";
import type { MultiValue } from "react-select";
import type { MutableRefObject } from "react";
// import du style
import "../../App.scss";
import style from "./HomePage.module.scss";
// import des icônes
import { ChevronRight } from "lucide-react";
import { singleSelectInLineStyle } from "../../styles/inLineStyle";

type CheckboxType = { map: boolean; storymap: boolean };

/**
 * Page d'accueil : titre, description et barre de navigation
 * @returns NavComponent
 */
function HomePage() {
	// récupération des données de traduction
	const { language, translation } = useTranslation();
	const { translationTitle, translationDescription } =
		useHomePageTranslations();

	const tagContainerRef = useRef<HTMLDivElement | null>(null);

	const [itemTypes, setItemTypes] = useState<CheckboxType>({
		map: true,
		storymap: true,
	});
	const [allTagsWithItems, setAllTagsWithItems] = useState<TagWithItemsType[]>(
		[],
	);
	const [allTagsOptions, setAllTagsOptions] = useState<OptionType[]>([]);
	const [selectedTags, setSelectedTags] = useState<MultiValue<OptionType>>([]);
	const [searchText, setSearchText] = useState<string>("");
	const [paginationObject, setPaginationObject] =
		useState<PaginationObjectType>({
			page: 1,
			limit: 2,
			hasMore: true,
		});
	const [loading, setLoading] = useState(false);

	const bottomRef: MutableRefObject<undefined> = useInfiniteScroll(
		() =>
			fetchAllTagsWithMapsAndStorymaps(
				itemTypes,
				paginationObject,
				setAllTagsWithItems,
				setPaginationObject,
				setLoading,
				searchText,
				selectedTags,
			),
		paginationObject.hasMore,
		loading,
	);

	useEffect(() => {
		setPaginationObject({
			page: 1,
			limit: 2,
			hasMore: true,
		});
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: inifinite loop
	useEffect(() => {
		fetchAllTagsForSelectOption(itemTypes, language, setAllTagsOptions);
	}, [language, itemTypes, loading]);

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
						onClickFunction={() => scrollToTagContainer(tagContainerRef)}
					/>
				</div>
			</section>
			<section className={style.tagContainer} ref={tagContainerRef}>
				<div className={style.tagContainerHeader}>
					<Select
						styles={singleSelectInLineStyle}
						options={allTagsOptions}
						delimiter="|"
						isMulti
						onChange={(newValue) =>
							handleFilterInputs(
								searchText,
								setSearchText,
								setSelectedTags,
								newValue,
								itemTypes,
								paginationObject,
								setAllTagsWithItems,
								setPaginationObject,
								setLoading,
							)
						}
						placeholder={translation[language].mapPage.aside.searchForTag}
					/>

					<input
						type="text"
						id="searchInput"
						value={searchText}
						onChange={(e) =>
							handleFilterInputs(
								e.target.value,
								setSearchText,
								setSelectedTags,
								selectedTags,
								itemTypes,
								paginationObject,
								setAllTagsWithItems,
								setPaginationObject,
								setLoading,
							)
						}
						placeholder={`${translation[language].button.search}...`}
					/>

					<ItemFilterComponent
						itemTypes={itemTypes}
						setItemTypes={setItemTypes}
						handleCheckboxChange={handleCheckboxChange}
					/>
				</div>
				<div>
					{isEmptyResult(allTagsWithItems) ? (
						<p>{translation[language].mapPage.noResult}</p>
					) : (
						allTagsWithItems?.map((tagWithItems) => {
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
						})
					)}
				</div>
				<div ref={bottomRef} />
				{loading && <div>Chargement...</div>}
			</section>
		</section>
	);
}

export default HomePage;
