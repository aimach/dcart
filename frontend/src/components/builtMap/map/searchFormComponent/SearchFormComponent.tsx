// import des bibliothèques
import { useEffect, useState } from "react";
import { useParams } from "react-router";
// import des composants
import LoaderComponent from "../../../common/loader/LoaderComponent";
import MultiSelectComponent from "../../../common/multiSelect/MultiSelectComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
import useFilterSearch from "../../../../utils/hooks/useFilterSearch";
// import des services
import {
	getAllGreatRegions,
	getAllDivinities,
	getTimeMarkers,
} from "../../../../utils/api/builtMap/getRequests";
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import {
	formatDataForReactSelect,
	createTimeOptions,
	handleMultiSelectChange,
} from "../../../../utils/functions/filter";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { OptionType } from "../../../../utils/types/commonTypes";
import type { MultiValue } from "react-select";
// import du style
import style from "./searchFormComponent.module.scss";

interface SearchFormComponentProps {
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

/**
 * Composant du formulaire de recherche de la carte "exploration"
 * @param {Dispatch<SetStateAction<boolean>>} props.setIsModalOpen - Modifie l'état d'affichage du modal
 * @returns Select (react-select) | LoaderComponent
 */
const SearchFormComponent = ({ setIsModalOpen }: SearchFormComponentProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération de l'id de la carte en cours
	const { mapId } = useParams();

	// récupération des données des stores
	const { userFilters, setUserFilters } = useMapFiltersStore();

	// définition des états pour gérer les données du formulaire
	const [dataLoaded, setDataLoaded] = useState<boolean>(false);
	const [greatRegions, setGreatRegions] = useState<OptionType[]>([]);
	const [divinities, setDivinities] = useState<OptionType[]>([]);
	const [timeOptions, setTimeOptions] = useState<OptionType[]>([]);
	const [afterValue, setAfterValue] = useState<OptionType | null>(null);
	const [beforeValue, setBeforeValue] = useState<OptionType | null>(null);
	const [afterOptions, setAfterOptions] = useState<OptionType[]>([]);
	const [beforeOptions, setBeforeOptions] = useState<OptionType[]>([]);

	useEffect(() => {
		// récupération de toutes les données pour le formulaire
		const fetchAllDatasForSearchForm = async () => {
			// récupération des grandes régions
			const allGreatRegions = await getAllGreatRegions();
			const formatedGreatRegions: OptionType[] = formatDataForReactSelect(
				allGreatRegions,
				language,
			);
			setGreatRegions(formatedGreatRegions);

			// récupération des divinités
			const allDivinities = await getAllDivinities();
			const formatedDivinities = formatDataForReactSelect(
				allDivinities,
				language,
			);
			setDivinities(formatedDivinities);

			// récupération des bornes temporelles
			const timeMarkers = await getTimeMarkers();
			const timeOptions = createTimeOptions(timeMarkers);
			setTimeOptions(timeOptions);
			setAfterOptions(timeOptions);
			setBeforeOptions(timeOptions);

			setDataLoaded(true);
		};
		fetchAllDatasForSearchForm();
	}, [language]);

	// utilisé pour mettre à jour les valeurs des options des bornes temporelles "AVANT" en fonction de ce qu'à choisi l'utilisateur
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

	// utilisé pour mettre à jour les valeurs des options des bornes temporelles "APRES" en fonction de ce qu'à choisi l'utilisateur
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

	// fonction pour gérer la soumission du formulaire (filtrage des points)
	const { fetchFilteredPoints } = useFilterSearch();
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		fetchFilteredPoints(mapId as string, userFilters);
		setIsModalOpen(false);
	};

	// fonction pour gérer le changement des valeurs du select
	const handleChange = (key: string, value: MultiValue<OptionType>) => {
		console.log(key, value);
		handleMultiSelectChange(
			key,
			value,
			setUserFilters,
			userFilters,
			setAfterValue,
			setBeforeValue,
		);
	};

	return (
		<div className={style.searchFormContainer}>
			{dataLoaded ? (
				<>
					<form method="post" onSubmit={handleSubmit} id="myForm">
						<div className={style.searchFormTextContainer}>
							{translation[language].modal.firstContent}{" "}
							<MultiSelectComponent
								options={greatRegions}
								selectKey="locationId"
								placeholder={translation[language].modal.chooseRegion}
								handleChange={handleChange}
							/>
							{translation[language].modal.secondContent}{" "}
							<MultiSelectComponent
								options={divinities}
								selectKey="elementId"
								placeholder={translation[language].modal.chooseDivinity}
								handleChange={handleChange}
							/>{" "}
							{translation[language].common.between}{" "}
							<MultiSelectComponent
								options={afterOptions}
								selectKey="post"
								placeholder={translation[language].modal.postDate}
								handleChange={handleChange}
							/>{" "}
							{translation[language].common.and}{" "}
							<MultiSelectComponent
								options={beforeOptions}
								selectKey="ante"
								placeholder={translation[language].modal.anteDate}
								handleChange={handleChange}
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
