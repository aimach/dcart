// import des bibliothèques
import { useEffect, useState } from "react";
// import des composants
import SelectElementForm from "./SelectElementForm";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFormStore } from "../../../../utils/stores/builtMap/mapFormStore";
import { updateMapFilterOptions } from "../../../../utils/api/builtMap/putRequests";
import {
	getAllPointsForDemoMap,
	getOneMapInfos,
} from "../../../../utils/api/builtMap/getRequests";
import { fetchElementOptions } from "../../../../utils/functions/filter";
// import des types
import type { OptionType } from "../../../../utils/types/commonTypes";
import type { MapInfoType } from "../../../../utils/types/mapTypes";
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

			const allElementsOptions = await fetchElementOptions(allPoints, language, false);
			setElementOptions(allElementsOptions);
		};
		getElementsOptionsByAttestationIds();

	}, [mapInfos?.attestations, language])

	useEffect(() => {
		if (mapInfos) {
			const elementFilter = mapInfos.filterMapContent?.find(
				(filter) =>
					(filter.filter as Record<string, string>).type === "element",
			);
			if (elementFilter) {
				setSelectedOption(
					(elementFilter.options as Record<string, string>).solution,
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
		const newMap = await getOneMapInfos(mapInfos?.id as string);
		setMapInfos(newMap);
	};



	return elementOptions.length > 0 && (
		<form className={style.commonFormContainer}>
			{/* <h4>{translation[language].backoffice.mapFormPage.addFilters}</h4> */}
			<h4>Construction du filtre "Elements"</h4>
			<div>
				<div className={style.commonFormInputContainer}>
					<div className={style.labelContainer}>
						<label htmlFor="basic">Basique</label>
						<p>
							Le filtre "Elements" se présentera sous la forme d'un
							select/options où l'utilisateur pourra parcourir la liste des
							options et en choisir une ou plusieurs.
						</p>
					</div>
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
				{/* <div className={style.commonFormInputContainer}>
				<div className={style.labelContainer}>
					<label htmlFor="automatic">Automatique</label>
					<p>
						Le filtre "Elements" se présentera sous la forme de checkboxs à 2
						niveaux : un premier niveau avec les théonymes et un second avec les
						épithètes.
					</p>
				</div>
				<div className={style.inputContainer}>
					<input
						id="automatic"
						name="element"
						type="radio"
						onChange={(event) => handleRadioChange(event)}
						checked={selectedOption === "automatic"}
					/>
				</div>
			</div> */}
				<div className={style.commonFormInputContainer}>
					<div className={style.labelContainer}>
						<label htmlFor="manual">Manuelle</label>
						<p>
							Le filtre "Elements" se présentera sous la forme de checkboxs à 2
							niveaux : un premier niveau avec les théonymes et un second avec
							les épithètes. Ces deux niveaux sont à construire sur-mesure
							ci-dessous
						</p>
					</div>
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
			</div>
			{selectedOption === "manual" && (
				<SelectElementForm elementOptions={elementOptions} mapInfos={mapInfos as MapInfoType} />
			)}
		</form>
	);
};

export default BuiltElementFilterForm;
