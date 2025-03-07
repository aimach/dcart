// import des bibliothèques
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import des composants
import NavigationButtonComponent from "../navigationButton/NavigationButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFormStore } from "../../../../utils/stores/builtMap/mapFormStore";
import { useShallow } from "zustand/shallow";
import { getUserFilters } from "../../../../utils/api/builtMap/getRequests";
import {
	addFiltersToMap,
	createNewMap,
} from "../../../../utils/api/builtMap/postRequests";
import {
	alreadyTwoFiltersChecked,
	getFilterLabel,
	noFilterChecked,
} from "../../../../utils/functions/filter";
// import des types
import type { FilterType } from "../../../../utils/types/filterTypes";
import type { MapInfoType } from "../../../../utils/types/mapTypes";
import type { ChangeEvent, FormEventHandler } from "react";
// import du style
import style from "../introForm/introForm.module.scss";

/**
 * Formulaire de la troisième étape : définition des filtres utilisateur pour la carte
 */
const UserMapFilterForm = () => {
	// récupération des données de la langue
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const {
		mapInfos,
		resetMapInfos,
		resetAllPoints,
		mapFilters,
		setMapFilters,
		resetMapFilters,
		step,
	} = useMapFormStore(useShallow((state) => state));

	// définition d'un état pour stocker tous les filtres utilisateur de la BDD
	const [userMapFilterTypes, setUserMapFilterTypes] = useState<FilterType[]>(
		[],
	);

	// au montage du composant, récupération de tous les filtres utilisateurs de la BDD
	useEffect(() => {
		const fetchUserMapFilterTypes = async () => {
			const allFilterTypes = await getUserFilters();
			setUserMapFilterTypes(allFilterTypes);
		};
		fetchUserMapFilterTypes();
	}, []);

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
	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		// création de la nouvelle carte avec les données stockées dans le store
		const newMap = await createNewMap(mapInfos as MapInfoType);
		// si la carte a bien été créée, ajout des filtres utilisateurs à la carte ou retour à la page des cartes
		if (newMap) {
			if (noFilterChecked(mapFilters)) {
				navigate("/backoffice/maps");
			} else {
				const response = await addFiltersToMap(newMap.id as string, mapFilters);
				if (response?.status === 201) {
					// réinitialisation des données du store
					resetMapInfos();
					resetMapFilters();
					resetAllPoints();
					navigate("/backoffice/maps");
				}
			}
		}
	};

	return (
		userMapFilterTypes && (
			<form onSubmit={handleSubmit} className={style.commonFormContainer}>
				<h4>{translation[language].backoffice.mapFormPage.addFilters}</h4>
				<p>{translation[language].backoffice.mapFormPage.filterIntroduction}</p>
				<div className={style.commonFormInputContainer}>
					{alreadyTwoFiltersChecked(mapFilters) && <p>Maximum atteint !</p>}
					{userMapFilterTypes.map((filter: FilterType) => {
						const label = getFilterLabel(filter.type, translation, language);
						if (filter.type !== "time") {
							return (
								<div
									key={filter.type}
									className={style.userFilterInputContainer}
								>
									<label htmlFor={filter.type}>{label}</label>
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
					<div className={style.userFilterInputContainer}>
						<label htmlFor="noFilter">
							{translation[language].backoffice.mapFormPage.noFilter}
						</label>
						<input
							id="noFilter"
							name="noFilter"
							type="checkbox"
							checked={noFilterChecked(mapFilters)}
							onChange={resetMapFilters}
						/>
					</div>
				</div>
				<NavigationButtonComponent step={step} nextButtonDisplayed={true} />
			</form>
		)
	);
};

export default UserMapFilterForm;
