// import des bibliothèques
import { useContext, useEffect, useState } from "react";
// import des composants
import NavigationButtonComponent from "../navigationButton/NavigationButtonComponent";
// import du context
import { TranslationContext } from "../../../../context/TranslationContext";
// import des services
import { useMapFormStore } from "../../../../utils/stores/mapFormStore";
import { useShallow } from "zustand/shallow";
import { getUserFilters } from "../../../../utils/loaders/loaders";
// import des types
import type { FilterType } from "../../../../utils/types/filterTypes";
// import du style
import style from "../demoCommonForm/demoCommonForm.module.scss";
import { getFilterLabel } from "../../../../utils/functions/functions";

const UserMapFilterForm = () => {
	// on importe la langue
	const { translation, language } = useContext(TranslationContext);

	// on importe les données du formulaire de la carte
	const { mapInfos, setMapInfos, step, setStep } = useMapFormStore(
		useShallow((state) => state),
	);

	// on va chercher tous les types de filtres existants
	const [userMapFilterTypes, setUserMapFilterTypes] = useState<FilterType[]>(
		[],
	);
	const fetchUserMapFilterTypes = async () => {
		try {
			const allFilterTypes = await getUserFilters();
			setUserMapFilterTypes(allFilterTypes);
		} catch (error) {
			console.error(
				"Erreur lors du chargement des filtres utilisateurs :",
				error,
			);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		fetchUserMapFilterTypes();
	}, []);

	return (
		userMapFilterTypes && (
			<form className={style.commonFormContainer}>
				<h4>{translation[language].backoffice.mapFormPage.addFilters}</h4>
				<p>{translation[language].backoffice.mapFormPage.filterIntroduction}</p>
				<div className={style.commonFormInputContainer}>
					{userMapFilterTypes.map((filter: FilterType) => {
						const label = getFilterLabel(filter.type, translation, language);
						if (filter.type !== "time") {
							return (
								<div
									key={filter.type}
									className={style.userFilterInputContainer}
								>
									<label htmlFor={filter.type}>{label}</label>
									<input id={filter.type} name={filter.type} type="checkbox" />
								</div>
							);
						}
					})}
					<div className={style.userFilterInputContainer}>
						<label htmlFor="noFilter">
							{translation[language].backoffice.mapFormPage.noFilter}
						</label>
						<input id="noFilter" name="noFilter" type="checkbox" />
					</div>
				</div>
				<NavigationButtonComponent step={step} />
			</form>
		)
	);
};

export default UserMapFilterForm;
