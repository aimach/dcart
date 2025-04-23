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
// import des types
import type { OptionType } from "../../../../utils/types/commonTypes";

interface SourceTypeFilterComponentProps {
	sourceTypeOptions: OptionType[];
	setSourceTypeValues: (values: string[]) => void;
}

/**
 * Composant de filtre de localisation
 * @param {Object} props
 * @param {OptionType[]} props.locationOptions - Liste des options pour le filtre de la localisation
 * @returns Select (react-select)
 */
const SourceTypeFilterComponent = ({
	sourceTypeOptions,
	setSourceTypeValues,
}: SourceTypeFilterComponentProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données depuis le store
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);

	// on récupère les valeurs par défaut si l'utilisateur a déjà sélectionné des filtres
	const defaultValues = useMemo(() => {
		return getSelectDefaultValues(
			userFilters.sourceTypeId as string,
			sourceTypeOptions,
		);
	}, [userFilters.sourceTypeId, sourceTypeOptions]);

	console.log(defaultValues);

	return (
		<div>
			<Select
				key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
				options={sourceTypeOptions}
				defaultValue={defaultValues}
				delimiter="|"
				isMulti
				onChange={(newValue) =>
					onMultiSelectChange(
						newValue,
						"sourceTypeId",
						setUserFilters,
						userFilters,
						setSourceTypeValues,
					)
				}
				placeholder={translation[language].mapPage.aside.searchForLocation}
				isClearable={false}
			/>
		</div>
	);
};

export default SourceTypeFilterComponent;
