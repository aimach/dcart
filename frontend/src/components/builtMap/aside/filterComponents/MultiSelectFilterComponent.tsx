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
import type { GroupBase, StylesConfig } from "react-select";

interface MultiSelectFilterComponentProps {
	styles: StylesConfig<OptionType, true, GroupBase<OptionType>> | undefined;
	optionsArray: OptionType[];
	setValues: (values: string[]) => void;
	userFilterId: string;
	placeholder: string;
}

/**
 * Composant de filtre multi-sélection
 * @param {Object} props

 * @param {StylesConfig<OptionType, true, GroupBase<OptionType>>} props.styles - Styles pour le composant Select
 * @param {OptionType[]} props.optionsArray - Tableau des options
 * @param {OptionType[]} props.setValues - Setter pour enregistrer les valeurs à afficher dans le rappel des filtres
 * @param {OptionType[]} props.userFilterId - L'identifiant du filtre utilisateur
 * @returns Select (react-select)
 */
const MultiSelectFilterComponent = ({
	styles,
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
				styles={styles}
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
