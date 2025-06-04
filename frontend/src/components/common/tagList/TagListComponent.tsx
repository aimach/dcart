// import des custom hooks
import { Link } from "react-router";
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des types
import type { TagWithItemsType } from "../../../utils/types/commonTypes";
import type { MapInfoType, TagType } from "../../../utils/types/mapTypes";
// import du style
import style from "./tagListComponent.module.scss";

type TagListComponentProps = {
	item:
		| TagWithItemsType["maps"][number] // sélectionne le type des items de "maps" de TagWithItemsType
		| TagWithItemsType["storymaps"][number] // sélectionne le type des items de "storymaps"
		| MapInfoType;
	withLink: boolean;
};

const TagListComponent = ({ item }: TagListComponentProps) => {
	const { language } = useTranslation();

	return (
		<div className={style.itemTags}>
			{(item.tags as TagType[]).slice(0, 3).map((tag: TagType) => (
				<Link to={`/tag/${tag.slug}`} key={tag.id}>
					<p>#{tag[`name_${language}`]}</p>
				</Link>
			))}
		</div>
	);
};

export default TagListComponent;
