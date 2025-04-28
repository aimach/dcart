// import des bibliothèques
import { useEffect, useState } from "react";
// import des composants
import SelectElementForm from "./SelectElementForm";
import LoaderComponent from "../../../common/loader/LoaderComponent";
import LabelComponent from "../../inputComponent/LabelComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFormStore } from "../../../../utils/stores/builtMap/mapFormStore";
import { updateMapFilterOptions } from "../../../../utils/api/builtMap/putRequests";
import {
	getAllPointsForDemoMap,
	getOneMapInfosById,
} from "../../../../utils/api/builtMap/getRequests";
import { fetchElementOptions } from "../../../../utils/functions/filter";
// import des types
import type { OptionType } from "../../../../utils/types/commonTypes";
// import du style
import style from "../introForm/introForm.module.scss";

const BuiltElementFilterForm = () => {
	const { translation, language } = useTranslation();

	const [selectedOption, setSelectedOption] = useState<string>("");
	const [elementOptions, setElementOptions] = useState<OptionType[]>([]);

	const { mapInfos, setMapInfos } = useMapFormStore();

	useEffect(() => {
		const getElementsOptionsByAttestationIds = async () => {
			const attestationIdsArray = mapInfos?.attestations.map(
				(attestation) => attestation.attestationIds,
			);

			const allAttestationsIds = attestationIdsArray?.join(",").split(",");
			const uniqueAttestationIds = new Set(allAttestationsIds);

			const allPoints = await getAllPointsForDemoMap(
				[...uniqueAttestationIds].toString(),
			);

			const allElementsOptions = await fetchElementOptions(
				allPoints,
				language,
				false,
			);
			setElementOptions(allElementsOptions);
		};
		getElementsOptionsByAttestationIds();
	}, [mapInfos?.attestations, language]);

	useEffect(() => {
		if (mapInfos) {
			const elementFilter = mapInfos.filterMapContent?.find(
				(filter) =>
					(filter.filter as Record<string, string>).type === "element",
			);
			if (elementFilter) {
				setSelectedOption(
					(elementFilter.options as Record<string, string>)?.solution ??
						"basic",
				);
			}
		}
	}, [mapInfos]);

	const handleRadioChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setSelectedOption(event.target.id);
		// requête de modification du filtre
		await updateMapFilterOptions(
			mapInfos?.id as string,
			"element",
			JSON.stringify({ solution: event.target.id }),
		);
		const newMap = await getOneMapInfosById(mapInfos?.id as string);
		setMapInfos(newMap);
	};

	return elementOptions.length > 0 ? (
		<form className={style.commonFormContainer}>
			<h4>
				{translation[language].backoffice.mapFormPage.filterForm.element.title}
			</h4>
			<div className={style.commonFormInputContainer}>
				<LabelComponent
					htmlFor="basic"
					label={
						translation[language].backoffice.mapFormPage.filterForm.element
							.basic.label
					}
					description={
						translation[language].backoffice.mapFormPage.filterForm.element
							.basic.description
					}
				/>
				<div className={style.inputContainer}>
					<input
						id="basic"
						name="element"
						type="radio"
						onChange={(event) => handleRadioChange(event)}
						checked={selectedOption === "basic"}
					/>
				</div>
			</div>
			<div className={style.commonFormInputContainer}>
				<LabelComponent
					htmlFor="manual"
					label={
						translation[language].backoffice.mapFormPage.filterForm.element
							.manual.label
					}
					description={
						translation[language].backoffice.mapFormPage.filterForm.element
							.manual.description
					}
				/>
				<div className={style.inputContainer}>
					<input
						id="manual"
						name="element"
						type="radio"
						onChange={(event) => handleRadioChange(event)}
						checked={selectedOption === "manual"}
					/>
				</div>
			</div>
			{selectedOption === "manual" && (
				<SelectElementForm elementOptions={elementOptions} />
			)}
		</form>
	) : (
		<LoaderComponent size={40} />
	);
};

export default BuiltElementFilterForm;
