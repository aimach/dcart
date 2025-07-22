// import des bibliothèques
import { useEffect, useState } from "react";
import { useParams } from "react-router";
// import des composants
import LoaderComponent from "../../../common/loader/LoaderComponent";
import MultiSelectComponent from "../../../common/multiSelect/MultiSelectComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
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
import { useMapFilterReminderStore } from "../../../../utils/stores/builtMap/mapFilterReminderStore";
// import des types
import type { Dispatch, SetStateAction } from "react";
import type { OptionType } from "../../../../utils/types/commonTypes";
import type { MultiValue } from "react-select";
import type { GreatRegionType } from "../../../../utils/types/mapTypes";
import type { UserFilterType } from "../../../../utils/types/filterTypes";
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
	const { mapId, mapSlug } = useParams();
	const mapIdentifier = mapId || mapSlug;

	// récupération des données des stores
	const { userFilters, setUserFilters } = useMapFiltersStore();
	const {
		locationNameValues,
		elementNameValues,
		setLocationNameValues,
		setElementNameValues,
		setLocationFilterReminders,
		setElementFilterReminders,
	} = useMapFilterReminderStore();

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
			const allGreatRegionsWithoutEmptyResult: GreatRegionType[] =
				allGreatRegions.filter(
					(region: GreatRegionType) =>
						region.nom_fr !== "Chypre" &&
						region.nom_fr !== "Iles britanniques" &&
						region.nom_fr !== "Non pertinent" &&
						region.nom_fr !== "Indéterminé",
				);
			const formatedGreatRegions: OptionType[] = formatDataForReactSelect(
				allGreatRegionsWithoutEmptyResult,
				language,
			);
			setGreatRegions(formatedGreatRegions);

			// récupération des divinités
			const allDivinities = await getAllDivinities();
			const formatedDivinities = formatDataForReactSelect(
				allDivinities,
				language,
				true,
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
		// ajout des valeurs des bornes temporelles dans les filtres de l'utilisateur
		const userFiltersWithTime: UserFilterType = {
			...userFilters,
			post: afterValue
				? Number.parseInt(afterValue.value as string, 10)
				: undefined,
			ante: beforeValue
				? Number.parseInt(beforeValue.value as string, 10)
				: undefined,
		};
		// mise à jour des filtres de l'utilisateur
		setUserFilters({
			...userFilters,
			post:
				typeof afterValue?.value === "string"
					? Number.parseInt(afterValue?.value as string, 10)
					: undefined,
			ante:
				typeof beforeValue?.value === "string"
					? Number.parseInt(beforeValue?.value as string, 10)
					: undefined,
		});

		// mise à jour des reminders pour le titre de la carte
		setLocationFilterReminders(locationNameValues as string[]);
		setElementFilterReminders(elementNameValues as string[]);

		// récupération des points filtrés
		fetchFilteredPoints(mapIdentifier as string, userFiltersWithTime);
		setIsModalOpen(false);
	};

	// fonction pour gérer le changement des valeurs du select
	const handleChange = (key: string, value: MultiValue<OptionType>) => {
		handleMultiSelectChange(
			key,
			value,
			setUserFilters,
			userFilters,
			setAfterValue,
			setBeforeValue,
			key === "locationId" ? setLocationNameValues : setElementNameValues,
		);
	};

	return (
		<div className={style.searchFormContainer}>
			{dataLoaded ? (
				<>
					<form method="post" onSubmit={handleSubmit} id="myForm">
						<div className={style.searchFormTextContainer}>
							{/* labels invisibles pour l'accessibilité */}
							<div>
								<label
									htmlFor="react-select-1-input"
									className={style.invisibleLabel}
								>
									{translation[language].modal.chooseRegion}
								</label>
								<label
									htmlFor="react-select-2-input"
									className={style.invisibleLabel}
								>
									{translation[language].modal.chooseRegion}
								</label>
								<label
									htmlFor="react-select-3-input"
									className={style.invisibleLabel}
								>
									{translation[language].modal.chooseDivinity}
								</label>
								<label
									htmlFor="react-select-4-input"
									className={style.invisibleLabel}
								>
									{translation[language].modal.chooseDivinity}
								</label>
								<label
									htmlFor="react-select-5-input"
									className={style.invisibleLabel}
								>
									{translation[language].modal.postDate}
								</label>
								<label
									htmlFor="react-select-6-input"
									className={style.invisibleLabel}
								>
									{translation[language].modal.postDate}
								</label>
								<label
									htmlFor="react-select-7-input"
									className={style.invisibleLabel}
								>
									{translation[language].modal.postDate}
								</label>
							</div>
							{translation[language].modal.firstContent}{" "}
							<MultiSelectComponent
								options={greatRegions}
								selectKey="locationId"
								placeholder={translation[language].modal.chooseRegion}
								handleChange={handleChange}
								isMulti={true}
							/>
							{translation[language].modal.secondContent}{" "}
							<MultiSelectComponent
								options={divinities}
								selectKey="elementId"
								placeholder={translation[language].modal.chooseDivinity}
								handleChange={handleChange}
								isMulti={true}
							/>{" "}
							{translation[language].common.between}{" "}
							<MultiSelectComponent
								options={afterOptions}
								selectKey="post"
								placeholder={translation[language].modal.postDate}
								handleChange={handleChange}
								isMulti={false}
							/>{" "}
							{translation[language].common.and}{" "}
							<MultiSelectComponent
								options={beforeOptions}
								selectKey="ante"
								placeholder={translation[language].modal.anteDate}
								handleChange={handleChange}
								isMulti={false}
							/>{" "}
						</div>
						<div className={style.searchFormButtonContainer}>
							<ButtonComponent
								type="submit"
								color="brown"
								textContent={translation[language].button.filter}
							/>
							<ButtonComponent
								type="button"
								color="brown"
								textContent={translation[language].button.seeAll}
								onClickFunction={() => setIsModalOpen(false)}
							/>
						</div>
					</form>
				</>
			) : (
				<LoaderComponent size={40} />
			)}
		</div>
	);
};

export default SearchFormComponent;
