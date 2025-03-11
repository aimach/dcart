// import des bibliothèques
// import des composants
// import des custom hooks
// import des services
// import des types
import { useTranslation } from "../../../utils/hooks/useTranslation";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import type { MapType } from "../../../utils/types/mapTypes";
import type { StorymapType } from "../../../utils/types/storymapTypes";
// import du style
import style from "./managementItem.module.scss";
// import des icônes
import { ImageOff, Pen, Trash } from "lucide-react";

type ManagementItemProps = {
	itemInfos: MapType | StorymapType;
	type: "map" | "storymap";
};

const ManagementItem = ({ itemInfos, type }: ManagementItemProps) => {
	// récupération des données de traduction
	const { language } = useTranslation();

	const { openDeleteModal, setIdToDelete } = useModalStore();

	// fonction déclenchée lors du clic sur l'icone de suppression
	const handleDeleteClick = (idToDelete: string) => {
		setIdToDelete(idToDelete);
		openDeleteModal();
	};

	return (
		<li className={style.managementItem} key={itemInfos.id}>
			<div className={style.managementItemTitleAndImage}>
				{type === "storymap" &&
					((itemInfos as StorymapType).image_url ? (
						<img
							src={(itemInfos as StorymapType).image_url}
							alt={(itemInfos as StorymapType)[`title_${language}`]}
						/>
					) : (
						<ImageOff />
					))}
				<div className={style.managementItemTitle}>
					<h4>
						{type === "map"
							? (itemInfos as MapType)[`name_${language}`]
							: (itemInfos as StorymapType)[`title_${language}`]}
					</h4>
					<p>{itemInfos[`description_${language}`]}</p>
				</div>
			</div>
			<div className={style.managementItemIcons}>
				<Pen />
				<Trash onMouseDown={() => handleDeleteClick(itemInfos.id)} />
			</div>
		</li>
	);
};

export default ManagementItem;
