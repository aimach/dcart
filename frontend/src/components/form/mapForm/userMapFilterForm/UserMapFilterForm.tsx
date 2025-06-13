// import des bibliothèques
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
// import des composants
import NavigationButtonComponent from "../navigationButton/NavigationButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFormStore } from "../../../../utils/stores/builtMap/mapFormStore";
import { useShallow } from "zustand/shallow";
import {
	getOneMapInfosById,
	getUserFilters,
} from "../../../../utils/api/builtMap/getRequests";
import { addFiltersToMap } from "../../../../utils/api/builtMap/postRequests";
import {
	alreadyTwoFiltersChecked,
	getFilterLabel,
	noFilterChecked,
} from "../../../../utils/functions/filter";
import { updateFiltersToMap } from "../../../../utils/api/builtMap/putRequests";
import {
	notifyCreateSuccess,
	notifyEditSuccess,
} from "../../../../utils/functions/toast";
// import des types
import type { FilterType } from "../../../../utils/types/filterTypes";
import type { ChangeEvent, FormEventHandler } from "react";
// import du style
import style from "../introForm/introForm.module.scss";
// import des icônes
import { CircleAlert } from "lucide-react";

/**
 * Formulaire de la troisième étape : définition des filtres utilisateur pour la carte
 */
const UserMapFilterForm = () => {
	// récupération des données de la langue
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const {
		mapInfos,
		setMapInfos,
		resetMapInfos,
		resetAllPoints,
		mapFilters,
		setMapFilters,
		resetMapFilters,
		step,
		setStep,
	} = useMapFormStore(useShallow((state) => state));

	// définition d'un état pour stocker tous les filtres utilisateur de la BDD
	const [userMapFilterTypes, setUserMapFilterTypes] = useState<FilterType[]>(
		[],
	);

	// au montage du composant, récupération de tous les filtres utilisateurs de la BDD
	// si en mode édition, mise à jour des filtres de la carte
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const fetchUserMapFilterTypes = async () => {
			const allFilterTypes = await getUserFilters();
			setUserMapFilterTypes(allFilterTypes);

			// si en mode édition, mise à jour des filtres de la carte
			if (mapInfos?.filterMapContent) {
				const newFilters = allFilterTypes
					.filter((filterType: FilterType) => filterType.type !== "time")
					.map((filter: FilterType) => {
						const index = mapInfos.filterMapContent?.findIndex((mapFilter) => {
							return mapFilter.filter?.type === filter.type;
						});
						if (index !== -1) {
							return { [filter.type]: true };
						}
						return { [filter.type]: false };
					});
				const newFiltersObject = Object.assign({}, ...newFilters);
				setMapFilters(newFiltersObject);
			}
		};
		fetchUserMapFilterTypes();
	}, [mapInfos?.filterMapContent]);

	// fonction qui gère le changement de valeur des checkbox
	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		// s'il n'y a pas déjà 2 filtres sélectionnés ou que l'utilisateur essaie de décocher un filtre
		if (
			!alreadyTwoFiltersChecked(mapFilters) ||
			event.target.checked === false
		) {
			setMapFilters({
				...mapFilters,
				[event.target.name]: event.target.checked,
			});
		}
	};

	// fonction qui gère la soumission du formulaire
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		if (pathname.includes("edit")) {
			// mise à jour des filtres
			const updatedFiltersResponse = await updateFiltersToMap(
				mapInfos?.id as string,
				mapFilters,
			);
			if (updatedFiltersResponse?.status === 200) {
				const newMapInfos = await getOneMapInfosById(mapInfos?.id as string);
				setMapInfos(newMapInfos);
				notifyEditSuccess("Jeu de filtres", false);
				if (mapFilters.element || mapFilters.location) {
					if (mapFilters.element) setStep(4);
					if (mapFilters.location) setStep(5);
				} else {
					// si aucun filtre n'est sélectionné, on redirige vers la page de la carte
					resetMapInfos();
					resetAllPoints();
					resetMapFilters();
					navigate("/backoffice/maps");
				}
			}
		} else if (pathname.includes("create")) {
			if (noFilterChecked(mapFilters)) {
				navigate("/backoffice/maps");
			} else {
				const response = await addFiltersToMap(
					mapInfos?.id as string,
					mapFilters,
				);
				if (response?.status === 201) {
					// réinitialisation des données du store
					resetMapInfos();
					resetMapFilters();
					resetAllPoints();
					notifyCreateSuccess("Jeu de filtres", false);
					navigate("/backoffice/maps");
				}
			}
		}
	};

	return (
		userMapFilterTypes && (
			<form onSubmit={handleSubmit} className={style.commonFormContainer}>
				<h4>{translation[language].backoffice.mapFormPage.addFilters}</h4>
				<div className={style.filterIntroductionContainer}>
					<CircleAlert />{" "}
					<p>
						{translation[language].backoffice.mapFormPage.filterIntroduction}
					</p>
				</div>

				{alreadyTwoFiltersChecked(mapFilters) && (
					<div className={style.alertContainer}>
						<CircleAlert color="#9d2121" />
						<p>{translation[language].alert.maxReached}</p>
					</div>
				)}
				{userMapFilterTypes
					.sort((option1, option2) =>
						option1.type < option2.type
							? -1
							: option1.type > option2.type
								? 1
								: 0,
					)
					.map((filter: FilterType) => {
						const { label, description } = getFilterLabel(
							filter.type,
							translation,
							language,
						);
						if (filter.type !== "time") {
							return (
								<div
									key={filter.type}
									className={style.commonFormInputContainer}
									style={{ justifyContent: "flex-start" }}
								>
									<div className={style.labelContainer}>
										<label htmlFor={filter.type}>{label}</label>
										<p>{description}</p>
									</div>
									<input
										id={filter.type}
										name={filter.type}
										type="checkbox"
										checked={mapFilters[filter.type]}
										onChange={(event) => handleCheckboxChange(event)}
									/>
								</div>
							);
						}
					})}
				<div
					className={style.commonFormInputContainer}
					style={{ justifyContent: "flex-start" }}
				>
					<div className={style.labelContainer}>
						<label htmlFor="noFilter">
							{translation[language].backoffice.mapFormPage.noFilter.label}
						</label>
						<p>
							{
								translation[language].backoffice.mapFormPage.noFilter
									.description
							}
						</p>
					</div>
					<input
						id="noFilter"
						name="noFilter"
						type="checkbox"
						checked={noFilterChecked(mapFilters)}
						onChange={resetMapFilters}
					/>
				</div>

				<NavigationButtonComponent step={step} nextButtonDisplayed={true} />
			</form>
		)
	);
};

export default UserMapFilterForm;
