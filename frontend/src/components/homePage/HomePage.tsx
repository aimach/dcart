// import des bibliothèques
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import Select from "react-select";
// import des composants
import ButtonComponent from "../common/button/ButtonComponent";
import ItemFilterComponent from "../common/itemFilter/ItemFilterComponent";
import ItemContainer from "../common/itemContainer/ItemContainer";
import { HomePageHelmetContent } from "../helmet/HelmetContent";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
import useHomePageTranslations from "../../utils/hooks/useHomepageTranslations";
// import des services
import {
	fetchAllTagsForSelectOption,
	fetchAllTagsWithMapsAndStorymaps,
	handleCheckboxChange,
	handleFilterInputs,
	isEmptyResult,
	scrollToTagContainer,
} from "../../utils/functions/homePage";
import { shuffleArray } from "../../utils/functions/common";
// import des types
import type {
	OptionType,
	TagWithItemsType,
} from "../../utils/types/commonTypes";
import type { MultiValue } from "react-select";
// import du style
import "../../App.scss";
import style from "./HomePage.module.scss";
import { singleSelectInLineStyle } from "../../styles/inLineStyle";
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

	useEffect(() => {
		fetchAllTagsWithMapsAndStorymaps(
			itemTypes,
			setAllTagsWithItems,
			searchText,
			selectedTags,
		);
	}, [itemTypes, searchText, selectedTags]);

	useEffect(() => {
		fetchAllTagsForSelectOption(itemTypes, language, setAllTagsOptions);
	}, [language, itemTypes]);

	return (
		<>
			<HomePageHelmetContent />
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
						{/* label invisible pour l'accessibilité */}

						<label
							htmlFor="react-select-2-input"
							className={style.invisibleLabel}
						>
							{translation[language].mapPage.aside.searchForTag}
						</label>
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
									setAllTagsWithItems,
								)
							}
							placeholder={translation[language].mapPage.aside.searchForTag}
						/>
						{/* label invisible pour l'accessibilité */}
						<label htmlFor="searchText" className={style.invisibleLabel}>
							{translation[language].button.search}
						</label>
						<input
							type="text"
							value={searchText}
							id="searchText"
							onChange={(e) =>
								handleFilterInputs(
									e.target.value,
									setSearchText,
									setSelectedTags,
									selectedTags,
									itemTypes,
									setAllTagsWithItems,
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
					<div className={style.tagItemList}>
						{isEmptyResult(allTagsWithItems) ? (
							<p>{translation[language].mapPage.noResult}</p>
						) : (
							allTagsWithItems?.map((tagWithItems) => {
								const itemsArray =
									tagWithItems.maps && tagWithItems.storymaps
										? tagWithItems.maps.concat(tagWithItems.storymaps)
										: tagWithItems.maps || tagWithItems.storymaps || [];
								const shuffledAndSlicedItemsArray = shuffleArray(
									itemsArray,
								).slice(0, 3);
								return (
									itemsArray.length > 0 && (
										<div
											key={tagWithItems.id}
											className={style.tagItemContainer}
										>
											<div className={style.tagItemContainerTitle}>
												<h2>{tagWithItems[`name_${language}`]}</h2>
												<Link to={`/tag/${tagWithItems.slug}`}>
													<div className={style.textButtonContainer}>
														{translation[language].button.seeAll}{" "}
														<ChevronRight />
													</div>
												</Link>
											</div>
											<div className={style.tagItemContainerItemList}>
												{shuffledAndSlicedItemsArray.map((item) => (
													<ItemContainer key={item.id} item={item} />
												))}
											</div>
										</div>
									)
								);
							})
						)}
					</div>
				</section>
			</section>
		</>
	);
}

export default HomePage;
