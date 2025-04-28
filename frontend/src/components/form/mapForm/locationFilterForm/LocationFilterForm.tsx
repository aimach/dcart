// import des bibliothèques
import { useEffect, useState } from "react";
// import des composants
import LabelComponent from "../../inputComponent/LabelComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFormStore } from "../../../../utils/stores/builtMap/mapFormStore";
import { updateMapFilterOptions } from "../../../../utils/api/builtMap/putRequests";
import { getOneMapInfosById } from "../../../../utils/api/builtMap/getRequests";
// import du style
import style from "../introForm/introForm.module.scss";

const LocationFilterForm = () => {
	const { translation, language } = useTranslation();

	const [selectedOption, setSelectedOption] = useState<string>("");

	const { mapInfos, setMapInfos } = useMapFormStore();

	useEffect(() => {
		if (mapInfos) {
			const locationFilter = mapInfos.filterMapContent?.find(
				(filter) =>
					(filter.filter as Record<string, string>).type === "location",
			);
			if (locationFilter) {
				setSelectedOption(
					(locationFilter.options as Record<string, string>)?.solution ??
						"greatRegion",
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
			"location",
			JSON.stringify({ solution: event.target.id }),
		);
		const newMap = await getOneMapInfosById(mapInfos?.id as string);
		setMapInfos(newMap);
	};

	return (
		<form className={style.commonFormContainer}>
			<h4>Choix du niveau du filtre "Lieu"</h4>
			<div className={style.commonFormInputContainer}>
				<LabelComponent
					htmlFor="greatRegion"
					label={
						translation[language].backoffice.mapFormPage.filterForm.location
							.greatRegion.label
					}
					description={
						translation[language].backoffice.mapFormPage.filterForm.location
							.greatRegion.description
					}
				/>
				<div className={style.inputContainer}>
					<input
						id="greatRegion"
						name="element"
						type="radio"
						onChange={(event) => handleRadioChange(event)}
						checked={selectedOption === "greatRegion"}
					/>
				</div>
			</div>
			<div className={style.commonFormInputContainer}>
				<LabelComponent
					htmlFor="subRegion"
					label={
						translation[language].backoffice.mapFormPage.filterForm.location
							.subRegion.label
					}
					description={
						translation[language].backoffice.mapFormPage.filterForm.location
							.subRegion.description
					}
				/>
				<div className={style.inputContainer}>
					<input
						id="subRegion"
						name="element"
						type="radio"
						onChange={(event) => handleRadioChange(event)}
						checked={selectedOption === "subRegion"}
					/>
				</div>
			</div>
			<div className={style.commonFormInputContainer}>
				<LabelComponent
					htmlFor="location"
					label={
						translation[language].backoffice.mapFormPage.filterForm.location
							.cityName.label
					}
					description={
						translation[language].backoffice.mapFormPage.filterForm.location
							.cityName.description
					}
				/>
				<div className={style.inputContainer}>
					<input
						id="location"
						name="element"
						type="radio"
						onChange={(event) => handleRadioChange(event)}
						checked={selectedOption === "location"}
					/>
				</div>
			</div>
		</form>
	);
};

export default LocationFilterForm;
