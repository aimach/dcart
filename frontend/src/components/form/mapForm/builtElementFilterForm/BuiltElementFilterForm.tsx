// import des bibliothèques
import { useEffect, useState } from "react";
// import des composants
import SelectElementForm from "./SelectElementForm";
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
import {
	getElementOptions,
	isSelectedFilterInThisMap,
} from "../../../../utils/functions/filter";
// import des types
import type { OptionType } from "../../../../utils/types/commonTypes";
// import du style
import style from "../introForm/introForm.module.scss";
import { CircleAlert } from "lucide-react";

const BuiltElementFilterForm = () => {
	const { translation, language } = useTranslation();

	const [selectedOption, setSelectedOption] = useState<string>("");
	const [elementOptions, setElementOptions] = useState<OptionType[]>([]);

	const { mapInfos, setMapInfos } = useMapFormStore();

	// biome-ignore lint/correctness/useExhaustiveDependencies: forcer le rechargement des options d'éléments
	useEffect(() => {
		const elementFilter = isSelectedFilterInThisMap(mapInfos, "element");
		if (elementFilter?.options?.solution === "manual") {
			const getElementsOptionsByAttestationIds = async () => {
				const attestationIdsArray = mapInfos?.attestations.map(
					(attestation) => attestation.attestationIds,
				);

				const allAttestationsIds = attestationIdsArray?.join(",").split(",");
				const uniqueAttestationIds = new Set(allAttestationsIds);

				const allPoints = await getAllPointsForDemoMap(
					[...uniqueAttestationIds].toString(),
				);

				const allElementsOptions = await getElementOptions(
					mapInfos,
					allPoints,
					language,
					false,
					true, // isForBackoffice
				);
				setElementOptions(allElementsOptions as OptionType[]);
			};
			getElementsOptionsByAttestationIds();
		}
	}, [mapInfos?.attestations, language]);

	useEffect(() => {
		setSelectedOption("basic");
		if (mapInfos) {
			const elementFilter = isSelectedFilterInThisMap(mapInfos, "element");
			if (elementFilter) {
				setSelectedOption(elementFilter.options?.solution ?? "basic");
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

	return (
		<form className={style.commonFormContainer}>
			<h4>
				{translation[language].backoffice.mapFormPage.filterForm.element.title}
			</h4>
			{elementOptions.length === 0 && (
				<div className={style.alertContainer}>
					<CircleAlert color="#9d2121" />
					<p>
						Attention ! Aucun élément n'est accessible. Avez-vous chargé des
						points dans la carte ?
					</p>
				</div>
			)}
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
					isRequired={false}
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
					isRequired={false}
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
			{elementOptions.length > 0 ? (
				selectedOption === "manual" ? (
					<SelectElementForm elementOptions={elementOptions} />
				) : null
			) : (
				<div className={style.alertContainer}>
					<CircleAlert color="#9d2121" />
					<p>Pas d'élément disponible pour construire le filtre.</p>
				</div>
			)}
		</form>
	);
};

export default BuiltElementFilterForm;
