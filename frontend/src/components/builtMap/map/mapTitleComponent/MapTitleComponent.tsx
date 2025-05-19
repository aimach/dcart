// import des custom hooks
import { useWindowSize } from "../../../../utils/hooks/useWindowSize";
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { displayFiltersTags } from "../../../../utils/functions/filter";
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import du style
import style from "./mapTitleComponent.module.scss";
// import des icônes
import { CircleHelp, Info, PanelLeft } from "lucide-react";

type MapTitleComponentProps = {
	setIsModalOpen: (isOpen: boolean) => void;
};

/**
 * Composant du titre de la carte affiché sur la carte, avec rappel des filtres appliqués
 */
const MapTitleComponent = ({ setIsModalOpen }: MapTitleComponentProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	const { isMobile } = useWindowSize();

	// récupération des données du store
	const { mapInfos, tutorialStep, openTutorial, resetTutorialStep } =
		useMapStore();

	const { setIsPanelDisplayed } = useMapAsideMenuStore();

	const {
		userFilters,
		locationNames,
		elementNames,
		languageValues,
		sourceTypeNames,
		agentStatusNames,
		agentivityNames,
		sourceMaterialNames,
	} = useMapFiltersStore();

	const filtersDetails = displayFiltersTags(
		userFilters,
		locationNames,
		elementNames,
		sourceTypeNames,
		agentStatusNames,
		agentivityNames,
		sourceMaterialNames,
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
				{!isMobile && (
					<h2>{mapInfos ? mapInfos[`title_${language}`] : "Exploration"}</h2>
				)}

				<Info onClick={() => setIsModalOpen(true)} />
				{isMobile && (
					<>
						<PanelLeft onClick={() => setIsPanelDisplayed(true)} />
						<CircleHelp
							onClick={() => {
								resetTutorialStep();
								openTutorial();
							}}
						/>
					</>
				)}
			</div>
			{!isMobile && (
				<div>
					{filtersDetails.length > 0 &&
						`${translation[language].mapPage.aside.filters} : `}
					<ul>
						{filtersDetails.map((filter) => (
							<li key={filter}>- {filter}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default MapTitleComponent;
