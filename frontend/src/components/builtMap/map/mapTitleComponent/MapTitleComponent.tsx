// import des custom hooks
import { useEffect } from "react";
import { useWindowSize } from "../../../../utils/hooks/useWindowSize";
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { displayFiltersTags } from "../../../../utils/functions/filter";
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useMapAsideMenuStore } from "../../../../utils/stores/builtMap/mapAsideMenuStore";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useMapFilterOptionsStore } from "../../../../utils/stores/builtMap/mapFilterOptionsStore";
import { useMapFilterReminderStore } from "../../../../utils/stores/builtMap/mapFilterReminderStore";
// import du type
import type { LatLngTuple } from "leaflet";
// import du style
import style from "./mapTitleComponent.module.scss";
// import des icônes
import { CircleHelp, Info, PanelLeft, RotateCcw } from "lucide-react";

type MapTitleComponentProps = {
	setIsModalOpen: (isOpen: boolean) => void;
	mapBounds: LatLngTuple[];
	fetchAllPoints: (type: "filter" | "reset") => Promise<void>;
};

/**
 * Composant du titre de la carte affiché sur la carte, avec rappel des filtres appliqués
 * @param {Object} props Les props du composant
 * @param {Function} props.setIsModalOpen Fonction pour ouvrir le modal d'information
 * @param {LatLngTuple[]} props.mapBounds Les limites de la carte
 * @param {Function} props.fetchAllPoints Fonction pour récupérer tous les points
 */
const MapTitleComponent = ({
	setIsModalOpen,
	mapBounds,
	fetchAllPoints,
}: MapTitleComponentProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	const { isMobile } = useWindowSize();

	// récupération des données du store
	const {
		map,
		mapInfos,
		tutorialStep,
		openTutorial,
		resetTutorialStep,
		setAllLayers,
	} = useMapStore();
	const { setIsPanelDisplayed } = useMapAsideMenuStore();
	const { resetInitialOptions, resetFilteredOptions } =
		useMapFilterOptionsStore();
	const { userFilters, resetUserFilters, isReset, setIsReset } =
		useMapFiltersStore();

	const {
		locationFilterReminders,
		elementFilterReminders,
		elementNbFilterReminders,
		languageFilterReminders,
		sourceTypeFilterReminders,
		agentStatusFilterReminders,
		agentivityFilterReminders,
		agentActivityFilterReminders,
		sourceMaterialFilterReminders,
		genderFilterReminders,
		resetFilterReminders,
		resetTemporaryReminderValues,
	} = useMapFilterReminderStore();

	const filtersDetails = displayFiltersTags(
		userFilters,
		locationFilterReminders,
		elementFilterReminders,
		elementNbFilterReminders,
		sourceTypeFilterReminders,
		agentStatusFilterReminders,
		agentivityFilterReminders,
		agentActivityFilterReminders,
		sourceMaterialFilterReminders,
		languageFilterReminders,
		genderFilterReminders,
		translation[language],
	);

	const handleResetButton = async () => {
		if (mapBounds.length > 0) {
			map?.fitBounds(mapBounds);
		}
		resetFilteredOptions();
		resetInitialOptions();
		resetUserFilters();
		resetFilterReminders();
		resetTemporaryReminderValues();
		setIsReset(!isReset);
		fetchAllPoints("reset");
		// réinitialisation des layers (indispensable ! sinon les layers s'accumulent)
		setAllLayers([]);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		// au montage, on supprime les valeurs de rappel des filtres résiduelles de la carte précédente
		resetFilterReminders();
	}, []);

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
				<RotateCcw onClick={handleResetButton} />
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
