// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import {
	displayFiltersTags,
	noUserFilterChecked,
} from "../../../../utils/functions/filter";
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import du style
import style from "./mapTitleComponent.module.scss";

/**
 * Composant du titre de la carte affiché sur la carte, avec rappel des filtres appliqués
 */
const MapTitleComponent = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données du store
	const { mapInfos } = useMapStore();

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
		<div className={style.mapTitleContainer}>
			<h2>{mapInfos ? mapInfos[`title_${language}`] : "Exploration"}</h2>
			<div>
				{!noUserFilterChecked(userFilters) &&
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
