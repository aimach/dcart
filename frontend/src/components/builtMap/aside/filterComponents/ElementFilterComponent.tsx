// import des bibliothèques
import { useMemo } from "react";
import Select from "react-select";
// import des composants
import ElementCheckboxComponent from "./ElementCheckboxComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation"; // import des services
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";
import {
	getSelectDefaultValues,
	isInList,
	onMultiSelectChange,
} from "../../../../utils/functions/filter";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import des types
import type { OptionType } from "../../../../utils/types/commonTypes";
import { singleSelectInLineStyle } from "../../../../styles/inLineStyle";

interface ElementFilterComponentProps {
	elementOptions: OptionType[];
	setElementNameValues: (names: string[]) => void;
	elementNameValues?: string[];
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
	elementNameValues,
}: ElementFilterComponentProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données des filtres depuis le store
	const { mapInfos } = useMapStore();
	const { userFilters, setUserFilters, isReset, elementNames } =
		useMapFiltersStore(useShallow((state) => state));

	// on récupère les valeurs par défaut si l'utilisateur a déjà sélectionné des filtres
	const getDefaultValues = useMemo(() => {
		return getSelectDefaultValues(
			userFilters.elementId as string,
			elementOptions,
		);
	}, [userFilters.elementId, elementOptions]);

	const filterOptions =
		mapInfos?.filterMapContent?.find(
			(filter) => filter.filter.type === "element",
		)?.options ?? null;

	// biome-ignore lint/correctness/useExhaustiveDependencies: volontairement stricte pour éviter les re-renders inutiles
	const optionsWithoutNotSelectedIds = useMemo(() => {
		if (!filterOptions?.checkbox) return [];
		return filterOptions.checkbox
			.map((option) => {
				if (!isInList(elementOptions, option.firstLevelIds[0])) return null;
				const secondLevelIdsWithFilteredElements = option.secondLevelIds.filter(
					(secondOption) => isInList(elementOptions, secondOption),
				);
				return {
					firstLevelIds: option.firstLevelIds,
					secondLevelIds: secondLevelIdsWithFilteredElements,
				};
			})
			.filter((option) => option !== null && option !== undefined);
	}, [elementNames, elementOptions]);

	if (filterOptions) {
		switch (filterOptions.solution) {
			case "basic":
				return (
					<div>
						<Select
							styles={singleSelectInLineStyle}
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
				);
			case "manual":
				return (
					optionsWithoutNotSelectedIds.length > 0 && (
						<div>
							{optionsWithoutNotSelectedIds.map((options) => {
								return (
									options && (
										<ElementCheckboxComponent
											options={options}
											key={options?.firstLevelIds[0].value}
											elementNameValues={elementNameValues as string[]}
											setElementNameValues={setElementNameValues}
										/>
									)
								);
							})}
						</div>
					)
				);
			default:
				return (
					<div>
						<Select
							styles={singleSelectInLineStyle}
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
				);
		}
	}
};

export default ElementFilterComponent;
