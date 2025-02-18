// import des bibliothèques
import { useContext } from "react";
import Select from "react-select";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";
import { useShallow } from "zustand/shallow";
// import des types
import type { MultiValue } from "react-select";
// import du style
import style from "./filtersComponent.module.scss";

type OptionType = { value: number; label: string };

interface LocationFilterComponentProps {
	locationOptions: OptionType[];
	locationLevel: string;
}

const LocationFilterComponent = ({
	locationOptions,
	locationLevel,
}: LocationFilterComponentProps) => {
	// on récupère les données de langue
	const { translation, language } = useContext(TranslationContext);

	// on récupère les données des filtres depuis le store
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);

	// on gère les changements du filtre générés par l'utilisateur
	const onMultiSelectChange = (selectedOptions: MultiValue<OptionType>) => {
		const locationValuesArray: number[] = [];
		for (const option of selectedOptions) {
			locationValuesArray.push(option.value);
		}
		const locationValuesString = locationValuesArray.join("|");
		setUserFilters({
			...userFilters,
			locationType: locationLevel,
			locationId: locationValuesString,
		});
	};

	// on récupère les valeurs par défaut si l'utilisateur a déjà sélectionné des filtres
	const getDefaultValues = () => {
		const defaultValues: OptionType[] = [];
		if (userFilters.locationId) {
			const locationValuesArray = userFilters.locationId.split("|");
			for (const locationValue of locationValuesArray) {
				const locationOption = locationOptions.find(
					(option) => option.value === Number.parseInt(locationValue, 10),
				);
				if (locationOption) {
					defaultValues.push(locationOption);
				}
			}
		}
		return defaultValues;
	};

	return (
		<div>
			<Select
				key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
				options={locationOptions}
				defaultValue={getDefaultValues()}
				delimiter="|"
				isMulti
				onChange={(newValue) => onMultiSelectChange(newValue)}
				placeholder={translation[language].mapPage.aside.searchForLocation}
			/>
		</div>
	);
};

export default LocationFilterComponent;
