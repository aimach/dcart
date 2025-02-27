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
} from "../../../utils/api/getRequests";
import { useMapStore } from "../../../utils/stores/mapStore";
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";
// import des types
import type {
	DivinityType,
	GreatRegionType,
	TimeMarkersType,
} from "../../../utils/types/mapTypes";
import type { Dispatch, SetStateAction } from "react";
import type { OptionType } from "../../../utils/types/commonTypes";
import type {
	CSSObjectWithLabel,
	MultiValue,
	ControlProps,
	SingleValue,
} from "react-select";
// import du style
import style from "./searchFormComponent.module.scss";
import LoaderComponent from "../../common/loader/LoaderComponent";

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
	const [afterValue, setAfterValue] = useState<OptionType | null>(null);
	const [beforeValue, setBeforeValue] = useState<OptionType | null>(null);
	const [afterOptions, setAfterOptions] = useState<OptionType[]>([]);
	const [beforeOptions, setBeforeOptions] = useState<OptionType[]>([]);

	useEffect(() => {
		fetchAllDatasForSearchForm();
	}, []);

	// utilisé pour mettre à jour les valeurs des options des bornes temporelles en fonction de ce qu'à choisi l'utilisateur
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (afterValue) {
			setBeforeOptions(
				timeOptions.filter((opt) => opt.value > afterValue.value),
			);
		} else {
			setBeforeOptions(timeOptions);
		}
	}, [afterValue]);

	// utilisé pour mettre à jour les valeurs des options des bornes temporelles en fonction de ce qu'à choisi l'utilisateur
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (beforeValue) {
			setAfterOptions(
				timeOptions.filter((opt) => opt.value < beforeValue.value),
			);
		} else {
			setAfterOptions(timeOptions);
		}
	}, [beforeValue]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		// Prevent the browser from reloading the page
		e.preventDefault();

		const allPoints = await getAllPointsByMapId("exploration", {
			...userFilters,
			post: afterValue?.value as number,
			ante: beforeValue?.value as number,
		});
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
			setAfterOptions(timeOptions);
			setBeforeOptions(timeOptions);

			setDataLoaded(true);
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des données pour le formulaire de recherche des sources :",
				error,
			);
		}
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
		selectedOptions: MultiValue<OptionType> | SingleValue<OptionType>,
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
		if (key === "post") {
			setAfterValue(selectedOptions as OptionType);
			// on met à jour les userFilters au moment du submit pour éviter de modifier le filtre temporel (qui est visible)
		}
		if (key === "ante") {
			setBeforeValue(selectedOptions as OptionType);
			// on met à jour les userFilters au moment du submit pour éviter de modifier le filtre temporel (qui est visible)
		}
	};

	// on créé le style
	const selectStyle = {
		control: (
			base: CSSObjectWithLabel,
			props: ControlProps<OptionType, true>,
		) => ({
			...base,
			border: props.isFocused ? "none" : "none",
			borderBottom: "1px solid #251F18",
			width: "200px",
		}),
		option: (
			base: CSSObjectWithLabel,
			{ isFocused }: { isFocused: boolean },
		) => ({
			...base,
			backgroundColor: isFocused ? "#DED6CE" : "white",
			":active": {
				backgroundColor: "#AD9A85",
			},
		}),
	};

	return (
		<div className={style.searchFormContainer}>
			{dataLoaded ? (
				<>
					<form method="post" onSubmit={handleSubmit} id="myForm">
						<div className={style.searchFormTextContainer}>
							{translation[language].modal.firstContent}{" "}
							<Select
								styles={selectStyle}
								options={greatRegions}
								delimiter="|"
								isMulti
								placeholder={translation[language].modal.chooseRegion}
								onChange={(newValue) =>
									onMultiSelectChange(
										"locationId",
										newValue as MultiValue<OptionType>,
									)
								}
								blurInputOnSelect
							/>
							{translation[language].modal.secondContent}{" "}
							<Select
								styles={selectStyle}
								inputId="elementId"
								options={divinities}
								delimiter="|"
								isMulti
								placeholder={translation[language].modal.chooseDivinity}
								onChange={(newValue) =>
									onMultiSelectChange(
										"elementId",
										newValue as MultiValue<OptionType>,
									)
								}
								blurInputOnSelect
							/>{" "}
							{translation[language].common.between}{" "}
							<Select
								styles={selectStyle}
								inputId="post"
								options={afterOptions}
								placeholder={translation[language].modal.postDate}
								value={afterValue}
								onChange={(newValue) => onMultiSelectChange("post", newValue)}
								blurInputOnSelect
							/>{" "}
							{translation[language].common.and}{" "}
							<Select
								styles={selectStyle}
								inputId="ante"
								options={beforeOptions}
								placeholder={translation[language].modal.anteDate}
								value={beforeValue}
								onChange={(newValue) => onMultiSelectChange("ante", newValue)}
								blurInputOnSelect
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
				</>
			) : (
				<LoaderComponent size={40} />
			)}
		</div>
	);
};

export default SearchFormComponent;
