// import des bibliothèques
import { useMemo } from "react";
import { useParams } from "react-router";
import DOMPurify from "dompurify";
// import des composants
import SearchFormComponent from "../../builtMap/map/searchFormComponent/SearchFormComponent";
import ButtonComponent from "../button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import { useMapStore } from "../../../utils/stores/builtMap/mapStore";
// import des types
import type { MapInfoType } from "../../../utils/types/mapTypes";
import type { Dispatch, SetStateAction } from "react";
// import du style
import style from "./modalComponent.module.scss";
// import des images
import delta from "../../../assets/delta.png";

interface MapIntroductionContentProps {
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

/**
 * Affiche le contenu du modal de suppression d'un block : texte de validation et boutons de confirmation (oui/non)
 */
const MapIntroductionContent = ({
	setIsModalOpen,
}: MapIntroductionContentProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération de l'id de la carte en cours
	const { mapId } = useParams();

	// récupération des données des stores
	const { mapInfos } = useMapStore();

	const sanitizedDescription = useMemo(() => {
		if (!mapInfos) return "";
		return DOMPurify.sanitize(
			(mapInfos as MapInfoType)[`description_${language}`],
		);
	}, [mapInfos, language]);

	return (
		<>
			{mapId === "exploration" && (
				<SearchFormComponent setIsModalOpen={setIsModalOpen} />
			)}
			{mapInfos && (
				<div className={style.introModalContent}>
					<div className={style.modalTitleSection}>
						<img src={delta} alt="decoration" width={30} />
						<h3>{(mapInfos as MapInfoType)[`title_${language}`]}</h3>
						<img src={delta} alt="decoration" width={30} />
					</div>
					<div className={style.modalImageAndTextSection}>
						{mapInfos.image_url && (
							<img
								src={mapInfos.image_url}
								alt="map"
								className={style.modalImage}
							/>
						)}
						<p // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
							dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
						/>
					</div>
					<ButtonComponent
						type="button"
						color="gold"
						textContent={translation[language].button.discover}
						onClickFunction={() => {
							setIsModalOpen(false);
							sessionStorage.setItem("isIntroDisplayed", "true");
						}}
					/>
				</div>
			)}
		</>
	);
};

export default MapIntroductionContent;
