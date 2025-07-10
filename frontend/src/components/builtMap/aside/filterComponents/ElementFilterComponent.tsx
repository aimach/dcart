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
import { singleSelectInLineStyle } from "../../../../styles/inLineStyle";
import { useMapFilterOptionsStore } from "../../../../utils/stores/builtMap/mapFilterOptionsStore";
import { useMapFilterReminderStore } from "../../../../utils/stores/builtMap/mapFilterReminderStore";

interface ElementFilterComponentProps {
	setElementNameValues: (names: string[]) => void;
	elementNameValues?: string[];
}

/**
 * Affiche le filtre des éléments
 * @returns Select (react-select)
 */
const ElementFilterComponent = ({
	setElementNameValues,
	elementNameValues,
}: ElementFilterComponentProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données des filtres depuis le store
	const { mapInfos } = useMapStore();
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);
	const { elementFilterReminders } = useMapFilterReminderStore();

	const { hasFilteredPoints, initialElementOptions, filteredElementOptions } =
		useMapFilterOptionsStore();

	// on récupère les valeurs par défaut si l'utilisateur a déjà sélectionné des filtres
	const getDefaultValues = useMemo(() => {
		return getSelectDefaultValues(
			userFilters.elementId as string,
			initialElementOptions,
		);
	}, [userFilters.elementId, initialElementOptions]);

	const filterOptions =
		mapInfos?.filterMapContent?.find(
			(filter) => filter.filter.type === "element",
		)?.options ?? null;

	// biome-ignore lint/correctness/useExhaustiveDependencies: volontairement stricte pour éviter les re-renders inutiles
	const optionsWithoutNotSelectedIds = useMemo(() => {
		if (!filterOptions?.checkbox) return [];
		if (hasFilteredPoints) {
			return filterOptions.checkbox
				.map((option) => {
					// si le premier niveau n'est pas dans la liste des éléments filtrés, on désactive tout le groupe
					if (!isInList(filteredElementOptions, option.firstLevelIds[0])) {
						return {
							firstLevelIds: [
								{
									isDisabled: true,
									...option.firstLevelIds[0],
								},
							],
							secondLevelIds: option.secondLevelIds.map((secondOption) => ({
								...secondOption,
								isDisabled: true,
							})),
						};
					}
					// si le premier niveau est dans la liste des éléments filtrés, on filtre les éléments du second niveau
					// et on désactive ceux qui ne sont pas dans la liste des éléments filtrés
					const secondLevelIdsWithFilteredElements = option.secondLevelIds.map(
						(secondOption) =>
							isInList(
								filteredElementOptions,
								option.firstLevelIds[0],
								secondOption,
							)
								? secondOption
								: { ...secondOption, isDisabled: true },
					);
					return {
						firstLevelIds: option.firstLevelIds,
						secondLevelIds: secondLevelIdsWithFilteredElements,
					};
				})
				.filter((option) => option !== null && option !== undefined);
		}
		return filterOptions?.checkbox.map((option) => {
			return {
				firstLevelIds: option.firstLevelIds.map((firstOption) => {
					return {
						...firstOption,
						isDisabled: false,
					};
				}),
				secondLevelIds: option.secondLevelIds.map((secondOption) => {
					return {
						...secondOption,
						isDisabled: false,
					};
				}),
			};
		});
	}, [elementFilterReminders, filteredElementOptions, hasFilteredPoints]);

	if (filterOptions) {
		switch (filterOptions.solution) {
			case "basic":
				return (
					<div>
						<Select
							styles={singleSelectInLineStyle}
							key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
							options={
								hasFilteredPoints
									? filteredElementOptions
									: initialElementOptions
							}
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
							options={initialElementOptions}
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
