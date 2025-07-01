// import des bibliothèques
import { useEffect, useState } from "react";
import Select from "react-select";
// import des composants
import ButtonComponent from "../../../common/button/ButtonComponent";
import LabelComponent from "../../inputComponent/LabelComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { updateMapFilterOptions } from "../../../../utils/api/builtMap/putRequests";
import { getOneMapInfosById } from "../../../../utils/api/builtMap/getRequests";
// import des types
import type { OptionType } from "../../../../utils/types/commonTypes";
import type { LotType } from "../../../../utils/types/filterTypes";
import { useMapFormStore } from "../../../../utils/stores/builtMap/mapFormStore";
// import du style
import style from "./builtElementFilterForm.module.scss";
import { singleSelectInLineStyle } from "../../../../styles/inLineStyle";

type SelectElementFormProps = {
	elementOptions: OptionType[];
};

const SelectElementForm = ({ elementOptions }: SelectElementFormProps) => {
	const { translation, language } = useTranslation();
	const { mapInfos, setMapInfos } = useMapFormStore();

	const [lots, setLots] = useState<LotType[]>([]); // les select/options en cours
	const [checkboxArray, setCheckboxArray] = useState<LotType[]>([]); // les select/options déjà sauvegardés

	useEffect(() => {
		const elementFilter = mapInfos?.filterMapContent?.find(
			(filter) => filter.filter.type === "element",
		);

		if (
			elementFilter?.options?.checkbox !== undefined &&
			elementFilter?.options?.checkbox.length > 0
		) {
			setCheckboxArray(elementFilter?.options?.checkbox as LotType[]);
			setLots([
				...(elementFilter?.options?.checkbox as LotType[]),
				{ firstLevelIds: [], secondLevelIds: [] },
			]);
		} else {
			setLots([{ firstLevelIds: [], secondLevelIds: [] }]);
		}
	}, [mapInfos]);

	const handleMultiSelectChange = async (index: number) => {
		const lotsWithoutEmpty = lots.filter(
			(lot) => lot.firstLevelIds.length > 0 && lot.secondLevelIds.length > 0,
		);
		const body = {
			solution: "manual",
			checkbox: [...lotsWithoutEmpty],
		};
		await updateMapFilterOptions(
			mapInfos?.id as string,
			"element",
			JSON.stringify(body),
		);
		const newMap = await getOneMapInfosById(mapInfos?.id as string);
		setMapInfos(newMap);
		const newFilters = newMap.filterMapContent?.find(
			(filter) => filter.filter.type === "element",
		).options.checkbox;
		setCheckboxArray(newFilters);
		setLots([...newFilters, { firstLevelIds: [], secondLevelIds: [] }]);
		if (index === lots.length - 1) {
			setLots([...lots, { firstLevelIds: [], secondLevelIds: [] }]);
		}
	};

	const handleDeleteMultiSelect = async (index: number) => {
		const newLots = lots.filter((_, i) => i !== index);
		setLots(
			newLots.length > 0
				? newLots
				: [{ firstLevelIds: [], secondLevelIds: [] }],
		);
		const body = {
			solution: "manual",
			checkbox: [
				...newLots.filter(
					(lot) =>
						lot.firstLevelIds.length > 0 && lot.secondLevelIds.length > 0,
				),
			],
		};
		await updateMapFilterOptions(
			mapInfos?.id as string,
			"element",
			JSON.stringify(body),
		);
		const newMap = await getOneMapInfosById(mapInfos?.id as string);
		setMapInfos(newMap);
		setCheckboxArray(
			newLots.filter((lot) => lot.firstLevelIds && lot.secondLevelIds),
		);
	};

	return (
		lots.length > 0 && (
			<div className={style.selectElementFormContainer}>
				{lots.map((lot, index) => {
					return (
						<div
							key={`${index}-${lot.secondLevelIds[-1]}`}
							className={style.allSelectContainer}
						>
							<div>
								<div className={style.selectContainer}>
									<LabelComponent
										htmlFor="firstLevelIds"
										label={
											translation[language].backoffice.mapFormPage.filterForm
												.element.firstLevel
										}
										description=""
									/>
									<Select
										styles={singleSelectInLineStyle}
										options={elementOptions}
										value={lot.firstLevelIds[0] || null}
										onChange={(newValue) => {
											const current = lots[index];
											if (!current) return;
											const newLots = [...lots];
											newLots[index] = {
												...current,
												firstLevelIds: [newValue as OptionType],
											};
											setLots(newLots);
										}}
										placeholder={
											translation[language].mapPage.aside.searchForElement
										}
										isClearable={true}
										isLoading={elementOptions.length === 0}
									/>
								</div>
								<div className={style.selectContainer}>
									<LabelComponent
										htmlFor="secondLevelIds"
										label={
											translation[language].backoffice.mapFormPage.filterForm
												.element.secondLevel
										}
										description=""
									/>
									<Select
										styles={singleSelectInLineStyle}
										options={elementOptions}
										value={lot.secondLevelIds}
										isMulti
										onChange={(newValue) => {
											const current = lots[index];
											if (!current) return;
											const newLots = [...lots];
											newLots[index] = {
												...current,
												secondLevelIds: newValue as OptionType[],
											};
											setLots(newLots);
										}}
										placeholder={
											translation[language].mapPage.aside.searchForElement
										}
										isClearable={true}
										isLoading={elementOptions.length === 0}
									/>
								</div>
							</div>
							<div className={style.buttonContainer}>
								<ButtonComponent
									type="button"
									color="brown"
									onClickFunction={() => handleMultiSelectChange(index)}
									textContent={translation[language].button.save}
								/>
								{checkboxArray.some(
									(checkbox) =>
										checkbox.firstLevelIds === lot.firstLevelIds &&
										checkbox.secondLevelIds === lot.secondLevelIds,
								) ? (
									<ButtonComponent
										type="button"
										color="red"
										onClickFunction={() => handleDeleteMultiSelect(index)}
										textContent={translation[language].button.delete}
									/>
								) : null}
							</div>
						</div>
					);
				})}
			</div>
		)
	);
};

export default SelectElementForm;
