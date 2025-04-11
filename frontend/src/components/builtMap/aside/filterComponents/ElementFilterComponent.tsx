// import des bibliothèques
import { useMemo, useState } from "react";
import Select from "react-select";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation"; // import des services
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";
import {
	getSelectDefaultValues,
	onMultiSelectChange,
} from "../../../../utils/functions/filter";
// import des types
import type { OptionType } from "../../../../utils/types/commonTypes";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import ElementCheckboxComponent from "./ElementCheckboxComponent";

interface ElementFilterComponentProps {
	elementOptions: OptionType[];
	setElementNameValues: (values: string[]) => void;
}

/**
 * Affiche le filtre des éléments
 * @param {Object} props
 * @param {OptionType[]} props.elementOptions - Liste des éléments pour le filtre des épithètes
 * @returns Select (react-select)
 */
const ElementFilterComponent = ({
	elementOptions,
	setElementNameValues,
}: ElementFilterComponentProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données des filtres depuis le store
	const { mapInfos } = useMapStore();
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);

	// on récupère les valeurs par défaut si l'utilisateur a déjà sélectionné des filtres
	const getDefaultValues = useMemo(() => {
		return getSelectDefaultValues(
			userFilters.elementId as string,
			elementOptions,
		);
	}, [userFilters.elementId, elementOptions]);

	const filterOptions = {};
	for (const filter of mapInfos?.filterMapContent) {
		if (filter.filter.type === "element") {
			Object.assign(filterOptions, filter.options);
		}
	}

	const [selected, setSelected] = useState({});

	switch (filterOptions.solution) {
		case "basic":
			return <div>
				<Select
					key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
					options={elementOptions}
					defaultValue={getDefaultValues}
					delimiter="|"
					isMulti
					onChange={(newValue) =>
						onMultiSelectChange(
							newValue,
							"elementId",
							setUserFilters,
							userFilters,
							setElementNameValues,
						)
					}
					placeholder={translation[language].mapPage.aside.searchForElement}
					isClearable={false}
				/>
			</div>;
		case "manual":
			return <div>{
				filterOptions.checkbox.map((options: { firstLevelIds: OptionType[], secondLevelIds: OptionType[] }) => {
					return (
						<ElementCheckboxComponent options={options} key={options.firstLevelIds[0].value} selected={selected} setSelected={setSelected} />)
				})
			}</div >;
		default:
			return <div>
				<Select
					key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
					options={elementOptions}
					defaultValue={getDefaultValues}
					delimiter="|"
					isMulti
					onChange={(newValue) =>
						onMultiSelectChange(
							newValue,
							"elementId",
							setUserFilters,
							userFilters,
							setElementNameValues,
						)
					}
					placeholder={translation[language].mapPage.aside.searchForElement}
					isClearable={false}
				/>

			</div>
	}

};

export default ElementFilterComponent;
