// import des bibliothèques
import Select from "react-select";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
import usePlaceOptionsByRegion from "../../../../utils/hooks/usePlaceOptionsByRegion";
// import des services
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";
import { onMultiSelectChange } from "../../../../utils/functions/filter";
import { useMapFilterOptionsStore } from "../../../../utils/stores/builtMap/mapFilterOptionsStore";
import { useMapFilterReminderStore } from "../../../../utils/stores/builtMap/mapFilterReminderStore";
// import du style
import { singleSelectInLineStyle } from "../../../../styles/inLineStyle";

/**
 * Composant de filtre par lieu (localité d'origine ou de découverte de la source)
 * La liste est restreinte aux grandes régions sélectionnées dans le filtre de localisation
 * @returns Select (react-select)
 */
const PlaceFilterComponent = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();
	// récupération des données depuis le store
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);

	const { hasFilteredPoints, initialPlaceOptions, filteredPlaceOptions } =
		useMapFilterOptionsStore();

	const { setPlaceNameValues } = useMapFilterReminderStore();

	// lieux restreints aux grandes régions choisies dans le filtre de localisation
	const { options, selectedOptions } = usePlaceOptionsByRegion(
		hasFilteredPoints ? filteredPlaceOptions : initialPlaceOptions,
	);

	return (
		<div>
			<Select
				styles={singleSelectInLineStyle}
				key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
				options={options}
				value={selectedOptions}
				delimiter="|"
				isMulti
				isOptionDisabled={(option) => option.isDisabled === true}
				onChange={(newValue) =>
					onMultiSelectChange(
						newValue,
						"placeId",
						setUserFilters,
						userFilters,
						setPlaceNameValues,
					)
				}
				placeholder={translation[language].mapPage.aside.searchForPlace}
				isClearable={false}
			/>
		</div>
	);
};

export default PlaceFilterComponent;
