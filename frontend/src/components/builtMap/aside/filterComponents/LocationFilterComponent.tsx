// import des bibliothèques
import { useMemo } from "react";
import Select from "react-select";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";
import {
	onMultiSelectChange,
	getSelectDefaultValues,
} from "../../../../utils/functions/filter";
import { useMapFilterOptionsStore } from "../../../../utils/stores/builtMap/mapFilterOptionsStore";
import { useMapFilterReminderStore } from "../../../../utils/stores/builtMap/mapFilterReminderStore";
// import du style
import { singleSelectInLineStyle } from "../../../../styles/inLineStyle";

/**
 * Composant de filtre de localisation
 * @param {Object} props
 * @param {OptionType[]} props.locationOptions - Liste des options pour le filtre de la localisation
 * @returns Select (react-select)
 */
const LocationFilterComponent = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();
	// récupération des données depuis le store
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);

	const { hasFilteredPoints, initialLocationOptions, filteredLocationOptions } =
		useMapFilterOptionsStore();

	const { setLocationNameValues } = useMapFilterReminderStore();

	// on récupère les valeurs par défaut si l'utilisateur a déjà sélectionné des filtres
	const getDefaultValues = useMemo(() => {
		return getSelectDefaultValues(
			userFilters.locationId as string,
			initialLocationOptions,
		);
	}, [userFilters.locationId, initialLocationOptions]);

	return (
		<div>
			<Select
				styles={singleSelectInLineStyle}
				key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
				options={
					hasFilteredPoints ? filteredLocationOptions : initialLocationOptions
				}
				defaultValue={getDefaultValues}
				delimiter="|"
				isMulti
				isOptionDisabled={(option) => option.isDisabled === true}
				onChange={(newValue) =>
					onMultiSelectChange(
						newValue,
						"locationId",
						setUserFilters,
						userFilters,
						setLocationNameValues,
					)
				}
				placeholder={translation[language].mapPage.aside.searchForLocation}
				isClearable={false}
			/>
		</div>
	);
};

export default LocationFilterComponent;
