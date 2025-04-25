// import des bibliothèques
import { useMemo } from "react";
import Select from "react-select";
// import des services
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";
import {
	onMultiSelectChange,
	getSelectDefaultValues,
} from "../../../../utils/functions/filter";
// import des types
import type { OptionType } from "../../../../utils/types/commonTypes";
import type { UserFilterType } from "../../../../utils/types/filterTypes";

interface MultiSelectFilterComponentProps {
	optionsArray: OptionType[];
	setValues: (values: string[]) => void;
	userFilterId: string;
	placeholder: string;
}

/**
 * Composant de filtre multi-sélection
 * @param {Object} props
 * @param {OptionType[]} props.optionsArray - Tableau des options
 * @param {OptionType[]} props.setValues - Setter pour enregistrer les valeurs à afficher dans le rappel des filtres
 * @param {OptionType[]} props.userFilterId - L'identifiant du filtre utilisateur
 * @returns Select (react-select)
 */
const MultiSelectFilterComponent = ({
	optionsArray,
	setValues,
	userFilterId,
	placeholder,
}: MultiSelectFilterComponentProps) => {
	// récupération des données depuis le store
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);

	// on récupère les valeurs par défaut si l'utilisateur a déjà sélectionné des filtres
	const defaultValues = useMemo(() => {
		return getSelectDefaultValues(
			userFilters[userFilterId as keyof UserFilterType] as string,
			optionsArray,
		);
	}, [
		userFilters[userFilterId as keyof UserFilterType],
		optionsArray,
		userFilterId,
	]);

	return (
		<div>
			<Select
				key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
				options={optionsArray}
				defaultValue={defaultValues}
				delimiter="|"
				isMulti
				onChange={(newValue) =>
					onMultiSelectChange(
						newValue,
						userFilterId,
						setUserFilters,
						userFilters,
						setValues,
					)
				}
				placeholder={placeholder}
				isClearable={false}
			/>
		</div>
	);
};

export default MultiSelectFilterComponent;
