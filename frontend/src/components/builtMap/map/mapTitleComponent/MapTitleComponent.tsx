// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { displayFiltersTags } from "../../../../utils/functions/filter";
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import du style
import style from "./mapTitleComponent.module.scss";
// import des icônes
import { Info } from "lucide-react";

type MapTitleComponentProps = {
	setIsModalOpen: (isOpen: boolean) => void;
};

/**
 * Composant du titre de la carte affiché sur la carte, avec rappel des filtres appliqués
 */
const MapTitleComponent = ({ setIsModalOpen }: MapTitleComponentProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données du store
	const { mapInfos, tutorialStep } = useMapStore();

	const { userFilters, locationNames, elementNames, languageValues } =
		useMapFiltersStore();

	const filtersDetails = displayFiltersTags(
		userFilters,
		locationNames,
		elementNames,
		languageValues,
		translation[language],
	);

	return (
		<div
			className={
				tutorialStep === 3
					? `${style.mapTitleContainer} ${style.shadowed}`
					: style.mapTitleContainer
			}
		>
			<div className={style.titleAndInfoContainer}>
				<h2>{mapInfos ? mapInfos[`title_${language}`] : "Exploration"}</h2>
				<Info onClick={() => setIsModalOpen(true)} />
			</div>
			<div>
				{filtersDetails.length > 0 &&
					`${translation[language].mapPage.aside.filters} : `}
				<ul>
					{filtersDetails.map((filter) => (
						<li key={filter}>- {filter}</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default MapTitleComponent;
