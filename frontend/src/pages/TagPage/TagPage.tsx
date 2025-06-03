// import des composants
import { useEffect, useState } from "react";
import { useParams } from "react-router";
// import des composants
import TitleAndTextComponent from "../../components/common/titleAndText/TitleAndTextComponent";
import ItemContainer from "../../components/common/itemContainer/ItemContainer";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
// import des services
import { getTagWithMapsAndStorymaps } from "../../utils/api/builtMap/getRequests";
import { shuffleArray } from "../../utils/functions/common";
// import des types
import type { TagWithItemsType } from "../../utils/types/commonTypes";
// import du style
import style from "./tagPage.module.scss";
import ItemFilterComponent from "../../components/common/itemFilter/ItemFilterComponent";

type CheckboxType = { map: boolean; storymap: boolean };

/**
 * Page de navigation qui présente toutes les catégories et les cartes associées
 * @returns TitleAndTextComponent | MapCategoryNav
 */
const TagPage = () => {
	// Récupération des données externes (context, store, params, etc.)
	const { language } = useTranslation();

	const { tagSlug } = useParams();

	const [tagWithItems, setTagWithItems] = useState<TagWithItemsType | null>(
		null,
	);
	const [tagItems, setTagItems] = useState<TagWithItemsType | null>(null);
	const [itemTypes, setItemTypes] = useState<CheckboxType>({
		map: true,
		storymap: true,
	});
	useEffect(() => {
		const fetchAllTagsWithMapsAndStorymaps = async (
			itemTypes: CheckboxType,
		) => {
			const fetchedTag = await getTagWithMapsAndStorymaps(
				tagSlug as string,
				itemTypes,
			);
			setTagWithItems(fetchedTag);
			const itemsArray =
				fetchedTag.maps && fetchedTag.storymaps
					? fetchedTag.maps.concat(fetchedTag.storymaps)
					: fetchedTag.maps || fetchedTag.storymaps || [];
			setTagItems(itemsArray);
		};

		fetchAllTagsWithMapsAndStorymaps(itemTypes);
	}, [tagSlug, itemTypes]);

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
		tagWithItems && (
			<section className={style.tagPageContainer}>
				<div className={style.tagPageTitleContainer}>
					<TitleAndTextComponent
						title={tagWithItems[`name_${language}`] as string}
						text={tagWithItems[`description_${language}`] as string}
					/>
				</div>
				<ItemFilterComponent
					itemTypes={itemTypes}
					handleCheckboxChange={handleCheckboxChange}
				/>
				<section className={style.tagPageItemsContainer}>
					{tagItems?.length > 0 &&
						tagItems.map((item) => {
							return <ItemContainer item={item} key={item.id} />;
						})}
				</section>
			</section>
		)
	);
};

export default TagPage;
