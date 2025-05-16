// import des composants
import { useEffect, useState } from "react";
import { useParams } from "react-router";
// import des composants
import TitleAndTextComponent from "../../components/common/titleAndText/TitleAndTextComponent";
// import des custom hooks
import { useTranslation } from "../../utils/hooks/useTranslation";
// import des services
import { getTagWithMapsAndStorymaps } from "../../utils/api/builtMap/getRequests";
import { shuffleArray } from "../../utils/functions/common";
// import des types
import type { TagWithItemsType } from "../../utils/types/commonTypes";
// import du style
import style from "./tagPage.module.scss";

import ItemContainer from "../../components/common/itemContainer/ItemContainer";

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
	useEffect(() => {
		const fetchAllTagsWithMapsAndStorymaps = async () => {
			const fetchedTag = await getTagWithMapsAndStorymaps(tagSlug as string);
			setTagWithItems(fetchedTag);
			const items = shuffleArray(fetchedTag.maps.concat(fetchedTag.storymaps));
			setTagItems(items);
		};

		fetchAllTagsWithMapsAndStorymaps();
	}, [tagSlug]);

	return (
		tagWithItems && (
			<section className={style.tagPageContainer}>
				<div className={style.tagPageTitleContainer}>
					<TitleAndTextComponent
						title={tagWithItems[`name_${language}`] as string}
						text={tagWithItems[`description_${language}`] as string}
					/>
				</div>
				<section className={style.tagPageItemsContainer}>
					{tagItems.length > 0 &&
						tagItems.map((item) => {
							return <ItemContainer item={item} key={item.id} />;
						})}
				</section>
			</section>
		)
	);
};

export default TagPage;
