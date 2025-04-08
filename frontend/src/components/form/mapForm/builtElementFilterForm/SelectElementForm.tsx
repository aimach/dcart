// import des bibliothèques
import { useEffect, useState } from "react";
import Select from "react-select";
// import des composants
import ButtonComponent from "../../../common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { updateMapFilterOptions } from "../../../../utils/api/builtMap/putRequests";
import { getOneMapInfos } from "../../../../utils/api/builtMap/getRequests";
// import des types
import type { OptionType } from "../../../../utils/types/commonTypes";
import type { MapInfoType } from "../../../../utils/types/mapTypes";
// import du style
import style from "./SelectElementForm.module.scss";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";

type SelectElementFormProps = {
	elementOptions: OptionType[];
	mapInfos: MapInfoType;
};

type lotType = {
	firstLevelIds: OptionType[]
	secondLevelIds: OptionType[]
}

const SelectElementForm = ({ elementOptions, mapInfos }: SelectElementFormProps) => {
	const { translation, language } = useTranslation();
	const { setMapInfos } = useMapStore();


	const [lots, setLots] = useState<lotType[]>([])
	const [checkboxArray, setCheckboxArray] = useState<lotType[]>([]);

	useEffect(() => {
		const elementFilter = mapInfos.filterMapContent?.find((filter) => filter.filter.type === "element");
		if (elementFilter?.options.checkbox?.length > 0) {
			setCheckboxArray(elementFilter?.options.checkbox as lotType[]);
			setLots([...elementFilter?.options.checkbox, { firstLevelIds: [], secondLevelIds: [] }]);
		} else {
			setLots([{ firstLevelIds: [], secondLevelIds: [] }]);
		}
	}, [mapInfos]);


	const handleMultiSelectChange = async (index: number) => {
		const current = lots[index];
		const body = {
			solution: "manual",
			checkbox: [...checkboxArray, current]
		}
		await updateMapFilterOptions(mapInfos.id as string, "element", JSON.stringify(body));
		const newMap = await getOneMapInfos(mapInfos?.id as string);
		setMapInfos(newMap);
		setCheckboxArray([...checkboxArray, current]);
		if (index === lots.length - 1) {
			setLots([...lots, { firstLevelIds: [], secondLevelIds: [] }]);
		}
	}


	const handleDeleteMultiSelect = async (index: number) => {
		const newLots = lots.filter((_, i) => i !== index);
		setLots(newLots.length > 0 ? newLots : [{ firstLevelIds: [], secondLevelIds: [] }]);
		const body = {
			solution: "manual",
			checkbox: [...newLots.filter((lot) => lot.firstLevelIds.length > 0 && lot.secondLevelIds.length > 0)]
		}
		await updateMapFilterOptions(mapInfos.id as string, "element", JSON.stringify(body));
		const newMap = await getOneMapInfos(mapInfos?.id as string);
		setMapInfos(newMap);
		setCheckboxArray(newLots.filter((lot) => lot.firstLevelIds && lot.secondLevelIds));
	}



	return lots.length > 0 && (
		<div>
			{lots.map((lot, index) => {
				return (
					<div key={index} >
						<div>
							<p>Premier niveau</p>
							<Select
								options={elementOptions}
								value={lot.firstLevelIds}
								isMulti
								onChange={(newValue) => {
									const current = lots[index];
									if (!current) return;
									const newLots = [...lots];
									newLots[index] = { ...current, firstLevelIds: newValue };
									setLots(newLots);
								}}
								placeholder={translation[language].mapPage.aside.searchForElement}
								isClearable={true}
							/>

						</div>
						<div>
							<p>Second niveau</p>
							<Select
								options={elementOptions}
								value={lot.secondLevelIds}
								isMulti
								onChange={(newValue) => {
									const current = lots[index];
									if (!current) return;
									const newLots = [...lots];
									newLots[index] = { ...current, secondLevelIds: newValue };
									setLots(newLots);
								}} placeholder={translation[language].mapPage.aside.searchForElement}
								isClearable={true}
							/>
						</div>
						<ButtonComponent type="button" color="brown" onClickFunction={() => handleMultiSelectChange(index)} textContent="Sauvegarder" />
						<ButtonComponent type="button" color="brown" onClickFunction={() => handleDeleteMultiSelect(index)} textContent="Supprimer" />

					</div>)

			})}
			{/* <ButtonComponent type="button" color="brown" onClickFunction={() => console.log("hello")} textContent="Ajouter" /> */}
		</div>);
};

export default SelectElementForm;
