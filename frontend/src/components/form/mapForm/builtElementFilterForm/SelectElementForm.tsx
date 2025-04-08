// import des bibliothèques
import { useState } from "react";
import Select from "react-select";
// import des composants
import ButtonComponent from "../../../common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { updateMapFilterOptions } from "../../../../utils/api/builtMap/putRequests";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
// import des types
import { OptionType } from "../../../../utils/types/commonTypes";
// import du style
import style from "./SelectElementForm.module.scss";

type SelectElementFormProps = {
	elementOptions: OptionType[];
};

const SelectElementForm = ({ elementOptions }: SelectElementFormProps) => {
	const { translation, language } = useTranslation();
	const [filterOptions, setFilterOptions] = useState({})
	const { mapInfos } = useMapStore();

	const handleMultiSelectChange = async (filterOptions) => {
		const body = {
			solution: "manual",
			firstLevelIds: filterOptions.firstLevelIds,
			secondLevelIds: filterOptions.secondLevelIds
		}

		await updateMapFilterOptions(mapInfos?.id as string, "element", JSON.stringify(body));
	}

	return (
		<div>
			<div>
				<p>Premier niveau</p>
				<Select
					options={elementOptions}
					// defaultValue={}
					delimiter="|"
					isMulti
					onChange={(newValue) => setFilterOptions({ ...filterOptions, firstLevelIds: newValue })}
					placeholder={translation[language].mapPage.aside.searchForElement}
					isClearable={true}
				/>

			</div>
			<div>
				<p>Second niveau</p>
				<Select
					options={elementOptions}
					// defaultValue={}
					delimiter="|"
					isMulti
					onChange={(newValue) => setFilterOptions({ ...filterOptions, secondLevelIds: newValue })}
					placeholder={translation[language].mapPage.aside.searchForElement}
					isClearable={true}
				/>
			</div>
			<ButtonComponent type="button" color="brown" onClickFunction={() => console.log("hello")} textContent="Ajouter" />
			<ButtonComponent type="button" color="brown" onClickFunction={() => handleMultiSelectChange(filterOptions)} textContent="Sauvegarder" />
		</div>);
};

export default SelectElementForm;