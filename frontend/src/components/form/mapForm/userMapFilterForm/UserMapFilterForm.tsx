// import des bibliothèques
import { useContext, useEffect, useState } from "react";
// import des composants
import NavigationButtonComponent from "../navigationButton/NavigationButtonComponent";
// import du context
import { TranslationContext } from "../../../../context/TranslationContext";
// import des services
import { useMapFormStore } from "../../../../utils/stores/mapFormStore";
import { useShallow } from "zustand/shallow";
import { getUserFilters } from "../../../../utils/api/getRequests";
// import des types
import type { FilterType } from "../../../../utils/types/filterTypes";
import type { MapInfoType } from "../../../../utils/types/mapTypes";
import type { ChangeEvent, FormEventHandler } from "react";
// import du style
import style from "../introForm/introForm.module.scss";
import {
	alreadyTwoFiltersChecked,
	getFilterLabel,
	noFilterChecked,
} from "../../../../utils/functions/filter";
import { useNavigate } from "react-router";
import {
	addFiltersToMap,
	createNewMap,
} from "../../../../utils/api/postRequests";

/**
 * Formulaire de la troisième étape : définition des filtres utilisateur pour la carte
 */
const UserMapFilterForm = () => {
	// on importe la langue
	const { translation, language } = useContext(TranslationContext);

	// on importe les données du formulaire de la carte
	const {
		mapInfos,
		resetMapInfos,
		resetAllPoints,
		mapFilters,
		setMapFilters,
		resetMapFilters,
		step,
	} = useMapFormStore(useShallow((state) => state));

	// on va chercher tous les types de filtres existants
	const [userMapFilterTypes, setUserMapFilterTypes] = useState<FilterType[]>(
		[],
	);

	useEffect(() => {
		const fetchUserMapFilterTypes = async () => {
			const allFilterTypes = await getUserFilters();
			setUserMapFilterTypes(allFilterTypes);
		};
		fetchUserMapFilterTypes();
	}, []);

	// on gère le changement des checkboxs
	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		// s'il n'y a pas déjà 2 filtres sélectionnés ou que l'utilisateur n'essaie pas de décocher un filtre
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

	// on gère la soumission du formulaire
	const navigate = useNavigate();
	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		const newMap = await createNewMap(mapInfos as MapInfoType);
		if (newMap) {
			if (noFilterChecked(mapFilters)) {
				navigate("/backoffice/maps");
			} else {
				const response = await addFiltersToMap(newMap.id as string, mapFilters);
				if (response?.status === 201) {
					// on reset tous les states
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
