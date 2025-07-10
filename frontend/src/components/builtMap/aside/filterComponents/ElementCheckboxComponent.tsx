// import des bibliothèques
import { useEffect } from "react";
// import des services
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
// import des types
import type { OptionType } from "../../../../utils/types/commonTypes";
// import des styles
import style from "./filtersComponent.module.scss";

export type SelectedObjectType = {
	[key: number]: {
		checked: boolean;
		children: number[];
	};
};

type ElementCheckboxComponentProps = {
	options: {
		firstLevelIds: OptionType[];
		secondLevelIds: OptionType[];
	};
	elementNameValues: string[];
	setElementNameValues: (names: string[]) => void;
};

const ElementCheckboxComponent = ({
	options,
	elementNameValues,
	setElementNameValues,
}: ElementCheckboxComponentProps) => {
	const {
		userFilters,
		setUserFilters,
		elementCheckboxSelected,
		setElementCheckboxSelected,
	} = useMapFiltersStore();

	const toggleFirstLevel = (option: OptionType) => {
		const isChecked = elementCheckboxSelected[option.value as number]?.checked;

		const newSelected = { ...elementCheckboxSelected };
		newSelected[option.value as number] = {
			checked: !isChecked,
			children: [],
		};
		setElementCheckboxSelected(newSelected);
		const newLotIds = !isChecked
			? [...userFilters.lotIds, [option.value as number]]
			: userFilters.lotIds.filter(
					(lot: number[]) => lot[0] !== (option.value as number),
				);
		setUserFilters({
			...userFilters,
			lotIds: newLotIds,
		});

		// On met à jour les noms des éléments sélectionnés
		const labelWithoutBrackets = option.label.replace(/\s*\(.*?\)/g, "").trim();
		if (!isChecked) {
			const newElementNameValues = elementNameValues;
			newElementNameValues.push(labelWithoutBrackets as string);
			setElementNameValues(newElementNameValues);
		} else {
			const filteredElementNameValues = elementNameValues.filter(
				(name) => name !== labelWithoutBrackets,
			);
			setElementNameValues(filteredElementNameValues);
		}
	};

	const toggleSecondLevel = (
		option: OptionType,
		child: OptionType,
		isChecked: boolean,
	) => {
		const group = elementCheckboxSelected[option.value as number] || {
			checked: false,
			children: [],
		};
		const children = group.children.includes(child.value as number)
			? group.children.filter((c: number) => c !== (child.value as number))
			: [...group.children, child.value as number];

		const newSelectedValue = {
			...elementCheckboxSelected,
			[option.value as number]: {
				checked: true,
				children,
			},
		};
		setElementCheckboxSelected(newSelectedValue);

		const newLotIds = Object.keys(newSelectedValue).reduce(
			(acc: string[][], key: string) => {
				if (newSelectedValue[key].checked) {
					return [
						// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
						...acc,
						[
							Number.parseInt(key, 10),
							...newSelectedValue[key].children.map((c: number) => c),
						],
					];
				}
				return acc;
			},
			[],
		);

		setUserFilters({
			...userFilters,
			lotIds: newLotIds,
		});

		// On met à jour les noms des éléments sélectionnés
		const labelWithoutBrackets = child.label.replace(/\s*\(.*?\)/g, "").trim();
		const firstLevelWithoutBrackets = option.label
			.replace(/\s*\(.*?\)/g, "")
			.trim();

		if (isChecked) {
			if (
				!elementNameValues.includes(
					`${firstLevelWithoutBrackets} ${labelWithoutBrackets}`,
				)
			) {
				setElementNameValues([
					...elementNameValues,
					`${firstLevelWithoutBrackets} ${labelWithoutBrackets}`,
				]);
			}
		} else {
			const filteredElementNameValues = elementNameValues.filter(
				(name) =>
					name !== `${firstLevelWithoutBrackets} ${labelWithoutBrackets}`,
			);
			setElementNameValues(filteredElementNameValues);
		}
	};

	// si userFilters.lotIds est vide, on vide les checkbox
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (userFilters.lotIds.length === 0) {
			setElementCheckboxSelected({});
		}
	}, [userFilters.lotIds]);

	return (
		<div className={style.elementCheckboxContainer}>
			<label className={style.checkboxLabel}>
				<input
					type="checkbox"
					checked={
						elementCheckboxSelected[options?.firstLevelIds[0].value as number]
							?.checked || false
					}
					onChange={() => {
						toggleFirstLevel(options.firstLevelIds[0]);
					}}
					disabled={options.firstLevelIds[0].isDisabled}
				/>
				<strong>{options.firstLevelIds[0].label}</strong>
			</label>
			<div className={style.checkboxGroup}>
				{options.secondLevelIds.map((option) => (
					<label
						key={option.value}
						style={{ display: "block" }}
						className={style.checkboxLabel}
					>
						<input
							type="checkbox"
							checked={
								elementCheckboxSelected[
									options?.firstLevelIds[0].value as number
								]?.children.includes(option.value as number) || false
							}
							onChange={(e) => {
								toggleSecondLevel(
									options.firstLevelIds[0],
									option,
									e.target.checked,
								);
							}}
							disabled={
								options.firstLevelIds[0].isDisabled ||
								option.isDisabled ||
								options.secondLevelIds.some((opt) => opt.isDisabled)
							}
						/>
						{option.label}
					</label>
				))}
			</div>
		</div>
	);
};

export default ElementCheckboxComponent;
