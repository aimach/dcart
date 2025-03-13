// import des services
import { useMapFormStore } from "../../../utils/stores/builtMap/mapFormStore";
import { getOneMapInfos } from "../../../utils/api/builtMap/getRequests";
import { updateMapActiveStatus } from "../../../utils/api/builtMap/putRequests";
import { updateStorymapStatus } from "../../../utils/api/storymap/putRequests";
// import des types
import { useNavigate } from "react-router";
import { useTranslation } from "../../../utils/hooks/useTranslation";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import type { MapType } from "../../../utils/types/mapTypes";
import type { StorymapType } from "../../../utils/types/storymapTypes";
// import du style
import style from "./managementItem.module.scss";
// import des icônes
import { Eye, EyeOff, ImageOff, Pen, Trash } from "lucide-react";

type ManagementItemProps = {
	itemInfos: MapType | StorymapType;
	type: "map" | "storymap";
};

const ManagementItem = ({ itemInfos, type }: ManagementItemProps) => {
	// récupération des données de traduction
	const { language } = useTranslation();

	// récupération des données des stores
	const { setMapInfos } = useMapFormStore();
	const { openDeleteModal, setIdToDelete, reload, setReload } = useModalStore();

	// fonction déclenchée lors du clic sur l'icone de suppression
	const handleDeleteClick = (idToDelete: string) => {
		setIdToDelete(idToDelete);
		openDeleteModal();
	};

	// fonction déclenchée lors du clic sur l'icone de modification
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

	// fonction déclenchée lors du clic sur l'icone de publication
	const handlePublicationClick = async (type: string, status: boolean) => {
		if (type === "map") {
			await updateMapActiveStatus(itemInfos.id, status);
		}
		if (type === "storymap") {
			await updateStorymapStatus(itemInfos.id, status);
		}
		setReload(!reload);
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
					<h4>{(itemInfos as StorymapType)[`title_${language}`]}</h4>
					<p>{itemInfos[`description_${language}`]}</p>
					<p>{itemInfos.isActive ? "Publiée" : "Non publiée"}</p>
				</div>
			</div>
			<div className={style.managementItemIcons}>
				<Pen onClick={() => handleModifyClick(itemInfos.id)} />
				<Trash onClick={() => handleDeleteClick(itemInfos.id)} />
				{itemInfos.isActive ? (
					<EyeOff onClick={() => handlePublicationClick(type, false)} />
				) : (
					<Eye onClick={() => handlePublicationClick(type, true)} />
				)}
			</div>
		</li>
	);
};

export default ManagementItem;
