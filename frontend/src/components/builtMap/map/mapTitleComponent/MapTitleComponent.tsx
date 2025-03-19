// import des bibliothèques
// import des composants
// import des custom hooks
import {
	displayFiltersTags,
	noFilterChecked,
	noUserFilterChecked,
} from "../../../../utils/functions/filter";
import { useTranslation } from "../../../../utils/hooks/useTranslation";
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
// import des services
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import des types
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

	const { userFilters, locationNames, elementNames } = useMapFiltersStore();

	const filtersDetails = displayFiltersTags(
		userFilters,
		locationNames,
		elementNames,
	);

	return (
		<div className={style.mapTitleContainer}>
			<h2>{mapInfos?.[`title_${language}`]}</h2>
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
