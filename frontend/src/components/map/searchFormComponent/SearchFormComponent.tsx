// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
// import des composants
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import {
	getAllGreatRegions,
	getAllDivinities,
	getTimeMarkers,
	getAllPointsByMapId,
} from "../../../utils/loaders/loaders";
import { useMapStore } from "../../../utils/stores/mapStore";
// import des types
import type {
	DivinityType,
	GreatRegionType,
	TimeMarkersType,
} from "../../../utils/types/mapTypes";
import type { Dispatch, SetStateAction } from "react";
import type { OptionType } from "../../../utils/types/commonTypes";
import type { MultiValue } from "react-select";
// import du style
import style from "./searchFormComponent.module.scss";
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";

interface SearchFormComponentProps {
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const SearchFormComponent = ({ setIsModalOpen }: SearchFormComponentProps) => {
	// on récupère le langage
	const { language, translation } = useContext(TranslationContext);

	// on récupère les points
	const { setAllPoints } = useMapStore();

	// on récupère les filtres de l'utilisateur
	const { userFilters, setUserFilters } = useMapFiltersStore();

	const [dataLoaded, setDataLoaded] = useState<boolean>(false);
	const [greatRegions, setGreatRegions] = useState<OptionType[]>([]);
	const [divinities, setDivinities] = useState<OptionType[]>([]);
	const [timeOptions, setTimeOptions] = useState<OptionType[]>([]);

	useEffect(() => {
		fetchAllDatasForSearchForm();
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		// Prevent the browser from reloading the page
		e.preventDefault();

		const allPoints = await getAllPointsByMapId("exploration", userFilters);
		setAllPoints(allPoints);
		setIsModalOpen(false);
	};

	const fetchAllDatasForSearchForm = async () => {
		try {
			// on récupère les grandes régions
			const allGreatRegions = await getAllGreatRegions();
			// on les formate pour qu'elles soient utilisables dans le select
			const formatedGreatRegions = allGreatRegions.map(
				(region: GreatRegionType) => {
					return {
						value: region.id,
						label: region[`nom_${language}` as keyof GreatRegionType],
					};
				},
			);
			// on les stocke dans le state
			setGreatRegions(formatedGreatRegions);

			// on récupère les divinités
			const allDivinities = await getAllDivinities();
			// on les formate pour qu'elles soient utilisables dans le select
			const formatedDivinities = allDivinities.map(
				(divinity: DivinityType) => ({
					value: divinity.id,
					label: divinity[`nom_${language}` as keyof DivinityType],
				}),
			);
			// on les stocke dans le state
			setDivinities(formatedDivinities);

			// on récupère les bornes temporelles
			const timeMarkers = await getTimeMarkers();
			const timeOptions = createTimeOptions(timeMarkers);

			setTimeOptions(timeOptions);

			setDataLoaded(true);
		} catch (error) {}
	};

	const createTimeOptions = (timeMarkers: TimeMarkersType) => {
		const options = [];
		for (let i = timeMarkers.post; i <= timeMarkers.ante; i += 100) {
			options.push({ value: i, label: i.toString() });
		}
		return options;
	};

	// on gère les changements du filtre générés par l'utilisateur
	const onMultiSelectChange = (
		key: string,
		selectedOptions: MultiValue<OptionType> | OptionType,
	) => {
		if (key === "locationId" || key === "elementId") {
			const valuesArray: number[] = [];
			for (const option of selectedOptions as MultiValue<OptionType>) {
				valuesArray.push(option.value as number);
			}
			const valuesString = valuesArray.join("|");
			setUserFilters({
				...userFilters,
				[key]: valuesString,
			});
		}
		if (key === "post" || key === "ante") {
			setUserFilters({
				...userFilters,
				[key]: (selectedOptions as OptionType).value as number,
			});
		}
	};

	return (
		dataLoaded && (
			<div className={style.searchFormContainer}>
				<form method="post" onSubmit={handleSubmit} id="myForm">
					<div>
						{translation[language].modal.firstContent}{" "}
						<Select
							options={greatRegions}
							delimiter="|"
							isMulti
							placeholder={translation[language].modal.chooseRegion}
							onChange={(newValue) =>
								onMultiSelectChange("locationId", newValue)
							}
						/>
						{translation[language].modal.secondContent}{" "}
						<Select
							inputId="elementId"
							options={divinities}
							delimiter="|"
							isMulti
							placeholder={translation[language].modal.chooseDivinity}
							onChange={(newValue) =>
								onMultiSelectChange("elementId", newValue)
							}
						/>{" "}
						{translation[language].common.between}{" "}
						<Select
							inputId="post"
							options={timeOptions}
							placeholder={translation[language].modal.postDate}
							onChange={(newValue) => onMultiSelectChange("post", newValue)}
						/>{" "}
						{translation[language].common.and}{" "}
						<Select
							inputId="ante"
							options={timeOptions}
							placeholder={translation[language].modal.anteDate}
							onChange={(newValue) => onMultiSelectChange("ante", newValue)}
						/>{" "}
					</div>
					<button type="submit">
						{translation[language].button.seeSources}
					</button>
				</form>
				<div>-- {translation[language].common.or} --</div>
				<button
					type="button"
					onClick={() => setIsModalOpen(false)}
					onKeyUp={() => setIsModalOpen(false)}
				>
					{translation[language].button.seeAll}
				</button>
			</div>
		)
	);
};

export default SearchFormComponent;
