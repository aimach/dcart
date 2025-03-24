// import des bibliothèques
import { useState, useEffect, useContext, useMemo } from "react";
import DOMPurify from "dompurify";
// import des services
import { useMapFormStore } from "../../../utils/stores/builtMap/mapFormStore";
import { getOneMapInfos } from "../../../utils/api/builtMap/getRequests";
import { updateMapActiveStatus } from "../../../utils/api/builtMap/putRequests";
import { updateStorymapStatus } from "../../../utils/api/storymap/putRequests";
import { getCreationAndModificationString } from "../../../utils/functions/map";
import { createSession, getSessionById } from "../../../utils/api/sessionAPI";
// import des types
import { useNavigate } from "react-router";
import { useTranslation } from "../../../utils/hooks/useTranslation";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import type { MapType } from "../../../utils/types/mapTypes";
import type { StorymapType } from "../../../utils/types/storymapTypes";
// import du style
import style from "./managementItem.module.scss";
// import des icônes
import { Eye, EyeOff, ImageOff, Pen, PenOff, Trash } from "lucide-react";
import { SessionContext } from "../../../context/SessionContext";
import { useStorymapLanguageStore } from "../../../utils/stores/storymap/storymapLanguageStore";

type ManagementItemProps = {
	itemInfos: MapType | StorymapType;
	type: "map" | "storymap";
};

const ManagementItem = ({ itemInfos, type }: ManagementItemProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données du contexte
	const { setSession } = useContext(SessionContext);

	// récupération des données des stores
	const { setMapInfos } = useMapFormStore();
	const { openDeleteModal, setIdToDelete, reload, setReload } = useModalStore();
	const { selectedLanguage } = useStorymapLanguageStore();

	// au montage du composant, vérification des sessions en cours
	const [isModifiedByAnotherUser, setIsModifiedByAnotherUser] =
		useState<boolean>(false);
	useEffect(() => {
		const checkSession = async () => {
			const sessionResponse = await getSessionById(itemInfos.id);
			if (sessionResponse?.status === 200) {
				setIsModifiedByAnotherUser(true);
			}
		};
		checkSession();
	}, [itemInfos.id]);

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
				// création d'une session de modification
				const session = await createSession(type, idToModify);
				setSession(session);
				// redirection vers la page de modification de carte
				navigate(`/backoffice/maps/edit/${idToModify}`);
			}
		} else {
			// redirection vers la page de modification de storymap
			navigate(`/backoffice/storymaps/build/${idToModify}`);
			// création d'une session de modification
			const session = await createSession(type, idToModify);
			setSession(session);
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

	// affichage des informations de création ou de modification
	const creationAndModificationString = getCreationAndModificationString(
		itemInfos,
		translation,
		language,
	);

	const sanitizedDescription = useMemo(() => {
		const shortDescription =
			type === "map"
				? (itemInfos as MapType)[`description_${language}`]
				: DOMPurify.sanitize(
						(itemInfos as StorymapType)[`description_${selectedLanguage}`],
					).slice(0, 300);
		return shortDescription.length < 300
			? shortDescription
			: `${shortDescription}...`;
	}, [itemInfos, selectedLanguage, language, type]);

	return (
		<li className={style.managementItem} key={itemInfos.id}>
			<div className={style.managementItemTitleAndImage}>
				{(itemInfos as StorymapType).image_url ? (
					<img
						src={(itemInfos as StorymapType).image_url}
						alt={(itemInfos as StorymapType)[`title_${selectedLanguage}`]}
					/>
				) : (
					<ImageOff />
				)}
				<div className={style.managementItemTitle}>
					<h4>
						{type === "map"
							? (itemInfos as MapType)[`title_${language}`]
							: (itemInfos as StorymapType)[`title_${selectedLanguage}`]}
					</h4>
					<p // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
						dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
					/>
					<p>{itemInfos.isActive ? "Publiée" : "Non publiée"}</p>
					<p className={style.greyAndItalic}>{creationAndModificationString}</p>
				</div>
			</div>
			<div className={style.managementItemIcons}>
				{isModifiedByAnotherUser ? (
					<PenOff />
				) : (
					<Pen onClick={() => handleModifyClick(itemInfos.id)} />
				)}

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
