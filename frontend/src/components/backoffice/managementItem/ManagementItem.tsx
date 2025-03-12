// import des bibliothèques
// import des composants
// import des custom hooks
// import des services
// import des types
import { useNavigate } from "react-router";
import { useTranslation } from "../../../utils/hooks/useTranslation";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import type { MapType } from "../../../utils/types/mapTypes";
import type { StorymapType } from "../../../utils/types/storymapTypes";
// import du style
import style from "./managementItem.module.scss";
// import des icônes
import { ImageOff, Pen, Trash } from "lucide-react";
import { getOneMapInfos } from "../../../utils/api/builtMap/getRequests";
import { useMapFormStore } from "../../../utils/stores/builtMap/mapFormStore";

type ManagementItemProps = {
	itemInfos: MapType | StorymapType;
	type: "map" | "storymap";
};

const ManagementItem = ({ itemInfos, type }: ManagementItemProps) => {
	// récupération des données de traduction
	const { language } = useTranslation();

	// récupération des données des stores
	const { setMapInfos } = useMapFormStore();
	const { openDeleteModal, setIdToDelete } = useModalStore();

	// fonction déclenchée lors du clic sur l'icone de suppression
	const handleDeleteClick = (idToDelete: string) => {
		setIdToDelete(idToDelete);
		openDeleteModal();
	};

	const navigate = useNavigate();
	const handleModifyClick = async (idToModify: string) => {
		if (type === "map") {
			// mise à jour des informations de la carte dans le store
			const allMapInfos = await getOneMapInfos(idToModify);
			setMapInfos(allMapInfos);
			if (allMapInfos) {
				navigate(`/backoffice/maps/edit/${idToModify}`);
			}
		} else {
			navigate(`/backoffice/storymaps/build/${idToModify}`);
		}
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
				<Pen onClick={() => handleModifyClick(itemInfos.id)} />
				<Trash onMouseDown={() => handleDeleteClick(itemInfos.id)} />
			</div>
		</li>
	);
};

export default ManagementItem;
