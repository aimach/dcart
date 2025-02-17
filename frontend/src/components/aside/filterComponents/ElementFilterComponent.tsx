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

interface ElementFilterComponentProps {
	elementOptions: OptionType[];
}

const ElementFilterComponent = ({
	elementOptions,
}: ElementFilterComponentProps) => {
	// on récupère les données de langue
	const { translation, language } = useContext(TranslationContext);

	// on récupère les données des filtres depuis le store
	const { userFilters, setUserFilters } = useMapFiltersStore(
		useShallow((state) => state),
	);

	// on gère les changements du filtre générés par l'utilisateur
	const onMultiSelectChange = (selectedOptions: MultiValue<OptionType>) => {
		const elementValuesArray: number[] = [];
		for (const option of selectedOptions) {
			elementValuesArray.push(option.value);
		}
		const elementValuesString = elementValuesArray.join("|");
		setUserFilters({
			...userFilters,
			elementId: elementValuesString,
		});
	};

	// on récupère les valeurs par défaut si l'utilisateur a déjà sélectionné des filtres
	const getDefaultValues = () => {
		const defaultValues: OptionType[] = [];
		if (userFilters.elementId) {
			const elementValuesArray = userFilters.elementId.split("|");
			for (const elementValue of elementValuesArray) {
				const elementOption = elementOptions.find(
					(option) => option.value === Number.parseInt(elementValue, 10),
				);
				if (elementOption) {
					defaultValues.push(elementOption);
				}
			}
		}
		return defaultValues;
	};

	return (
		<div>
			<Select
				options={elementOptions}
				defaultValue={getDefaultValues()}
				delimiter="|"
				isMulti
				onChange={(newValue) => onMultiSelectChange(newValue)}
				placeholder={translation[language].mapPage.aside.searchForElement}
			/>
		</div>
	);
};

export default ElementFilterComponent;
