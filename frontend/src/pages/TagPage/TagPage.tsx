// import des composants
import { useEffect, useState } from "react";
import { useParams } from "react-router";
// import des composants
import TitleAndTextComponent from "../../components/common/titleAndText/TitleAndTextComponent";
import ItemContainer from "../../components/common/itemContainer/ItemContainer";
import ItemFilterComponent from "../../components/common/itemFilter/ItemFilterComponent";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
// import des services
import { getTagWithMapsAndStorymaps } from "../../utils/api/builtMap/getRequests";
// import des types
import type { TagWithItemsType } from "../../utils/types/commonTypes";
// import du style
import style from "./tagPage.module.scss";
import { TagPageHelmetContent } from "../../components/helmet/HelmetContent";

type CheckboxType = { map: boolean; storymap: boolean };

/**
 * Page de navigation qui présente toutes les catégories et les cartes associées
 * @returns TitleAndTextComponent
 */
const TagPage = () => {
	// Récupération des données externes (context, store, params, etc.)
	const { language } = useTranslation();

	const { tagSlug } = useParams();

	const [tagWithItems, setTagWithItems] = useState<TagWithItemsType | null>(
		null,
	);
	const [tagItems, setTagItems] = useState<TagWithItemsType[] | null>(null);
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
					setItemTypes={setItemTypes}
					handleCheckboxChange={handleCheckboxChange}
				/>
				<section className={style.tagPageItemsContainer}>
					{tagItems &&
						tagItems?.length > 0 &&
						tagItems.map((item) => {
							return (
								<div key={item.id}>
									<TagPageHelmetContent
										tagName={`${tagWithItems[`name_${language}`]}`}
									/>
									<ItemContainer
										item={
											item as unknown as
												| TagWithItemsType["maps"][number]
												| TagWithItemsType["storymaps"][number]
										}
									/>
								</div>
							);
						})}
				</section>
			</section>
		)
	);
};

export default TagPage;
