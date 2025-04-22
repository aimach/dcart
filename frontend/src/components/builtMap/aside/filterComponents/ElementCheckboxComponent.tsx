// import des types
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import type { OptionType } from "../../../../utils/types/commonTypes";

type ElementCheckboxComponentProps = {
	options: {
		firstLevelIds: OptionType[];
		secondLevelIds: OptionType[];
	};
	selected: any;
	setSelected: (selected: any) => void;
};

const ElementCheckboxComponent = ({
	options,
	selected,
	setSelected,
}: ElementCheckboxComponentProps) => {
	const { userFilters, setUserFilters } = useMapFiltersStore();

	const toggleFirstLevel = (optionId: number) => {
		const isChecked = selected[optionId]?.checked;
		const children = options.secondLevelIds;

		const newSelected = { ...selected };
		newSelected[optionId] = {
			checked: !isChecked,
			children: !isChecked ? children.map((c) => c.value) : [],
		};
		setSelected(newSelected);
		const newLotIds = !isChecked
			? [...userFilters.lotIds, [optionId, ...children.map((c) => c.value)]]
			: userFilters.lotIds.filter((lot: number[]) => lot[0] !== optionId);
		setUserFilters({
			...userFilters,
			lotIds: newLotIds,
		});
	};

	const toggleSecondLevel = (optionId: number, childId: number) => {
		const group = selected[optionId] || { checked: false, children: [] };
		const children = group.children.includes(childId)
			? group.children.filter((c: number) => c !== childId)
			: [...group.children, childId];

		const newSelectedValue = {
			...selected,
			[optionId]: {
				checked: children.length > 0,
				children,
			},
		};
		setSelected(newSelectedValue);

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
	};

	console.log(userFilters);

	return (
		<div style={{ marginBottom: "1rem" }}>
			<label>
				<input
					type="checkbox"
					checked={selected[options.firstLevelIds[0].value]?.checked || false}
					onChange={() =>
						toggleFirstLevel(
							Number.parseInt(options.firstLevelIds[0].value as string, 10),
						)
					}
				/>
				<strong>{options.firstLevelIds[0].label}</strong>
			</label>
			<div style={{ paddingLeft: "1.5rem" }}>
				{options.secondLevelIds.map((option) => (
					<label key={option.value} style={{ display: "block" }}>
						<input
							type="checkbox"
							checked={
								selected[options.firstLevelIds[0].value]?.children.includes(
									option.value,
								) || false
							}
							onChange={() =>
								toggleSecondLevel(
									Number.parseInt(options.firstLevelIds[0].value as string, 10),
									Number.parseInt(option.value as string, 10),
								)
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
