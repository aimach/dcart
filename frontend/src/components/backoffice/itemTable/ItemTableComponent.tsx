// import des bibliothèques
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import DOMPurify from "dompurify";
import truncate from "truncate-html";
// import des composants
import TagComponent from "../../common/tag/TagComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import du contexte
import { AuthContext } from "../../../context/AuthContext";
import { SessionContext } from "../../../context/SessionContext";
// import des services
import { createSession, getSessionById } from "../../../utils/api/sessionAPI";
import { useStorymapLanguageStore } from "../../../utils/stores/storymap/storymapLanguageStore";
import { useMapFormStore } from "../../../utils/stores/builtMap/mapFormStore";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import { getOneMapInfosById } from "../../../utils/api/builtMap/getRequests";
import { updateMapActiveStatus } from "../../../utils/api/builtMap/putRequests";
import { updateStorymapStatus } from "../../../utils/api/storymap/putRequests";
// import des types
import type { MapType } from "../../../utils/types/mapTypes";
import type { StorymapType } from "../../../utils/types/storymapTypes";
// import du style
import style from "./itemTableComponent.module.scss";
// import des icônes
import { Eye, EyeOff, ImageOff, Pen, PenOff, Trash } from "lucide-react";

type ItemTableComponentProps = {
	itemInfos: MapType | StorymapType;
	type: "map" | "storymap";
};

const ItemTableComponent = ({ itemInfos, type }: ItemTableComponentProps) => {
	const { translation, language } = useTranslation();
	const { selectedLanguage } = useStorymapLanguageStore();

	const { setSession } = useContext(SessionContext);
	const { isAdmin } = useContext(AuthContext);

	const { setMapInfos } = useMapFormStore();
	const { openDeleteModal, setIdToDelete, reload, setReload } = useModalStore();

	const sanitizedDescription = useMemo(() => {
		const shortDescription =
			type === "map"
				? DOMPurify.sanitize((itemInfos as MapType)[`description_${language}`])
				: DOMPurify.sanitize(
						(itemInfos as StorymapType)[`description_${selectedLanguage}`],
					);

		return shortDescription.length > 100
			? truncate(shortDescription, 100, { ellipsis: "…" })
			: shortDescription;
	}, [itemInfos, selectedLanguage, language, type]);

	const [isModifiedByAnotherUser, setIsModifiedByAnotherUser] =
		useState<boolean>(false);
	useEffect(() => {
		const checkSession = async () => {
			const sessionResponse = await getSessionById(itemInfos.id);
			if (sessionResponse?.data.sessionExists) {
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
			const allMapInfos = await getOneMapInfosById(idToModify);
			setMapInfos(allMapInfos);
			if (allMapInfos) {
				navigate(`/backoffice/maps/edit/${idToModify}`);
				const session = await createSession(type, idToModify);
				setSession(session);
			}
		} else {
			navigate(`/backoffice/storymaps/${idToModify}`);
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
	return (
		<tr key={itemInfos.id} className={style.itemTableRow}>
			<td>
				<div>
					{(itemInfos as StorymapType).image_url ? (
						<img
							src={(itemInfos as StorymapType).image_url}
							alt={(itemInfos as StorymapType)[`title_${selectedLanguage}`]}
							width={100}
						/>
					) : (
						<ImageOff />
					)}
				</div>
			</td>
			<td>
				{type === "map"
					? (itemInfos as MapType)[`title_${language}`]
					: (itemInfos as StorymapType)[`title_${selectedLanguage}`]}
				<p // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
					dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
					className={style.descriptionCell}
				/>
			</td>

			<td>
				{itemInfos.isActive ? (
					<TagComponent
						text={translation[language].common.published}
						color="green"
					/>
				) : (
					<TagComponent
						text={translation[language].common.noPublished}
						color="red"
					/>
				)}
			</td>
			<td>
				{new Date(itemInfos.createdAt).toLocaleDateString(language, {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</td>
			<td>
				{itemInfos.modifier
					? new Date(itemInfos.updatedAt).toLocaleDateString(language, {
							year: "numeric",
							month: "long",
							day: "numeric",
						})
					: ""}
			</td>
			<td>
				{itemInfos.modifier
					? itemInfos.modifier.pseudo
					: itemInfos.creator.pseudo}
			</td>
			<td>
				{isAdmin &&
					(itemInfos.isActive ? (
						<EyeOff onClick={() => handlePublicationClick(type, false)} />
					) : (
						<Eye onClick={() => handlePublicationClick(type, true)} />
					))}
				{isModifiedByAnotherUser ? (
					<PenOff />
				) : (
					<Pen onClick={() => handleModifyClick(itemInfos.id)} />
				)}
				{isAdmin && (
					<Trash
						color="#9d2121"
						onClick={() => handleDeleteClick(itemInfos.id)}
					/>
				)}
			</td>
		</tr>
	);
};

export default ItemTableComponent;
