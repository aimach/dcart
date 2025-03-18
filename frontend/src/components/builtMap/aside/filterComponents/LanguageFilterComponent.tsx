// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";

/**
 * Composant de filtre pour les langues (grec, sémitique)
 */
const LanguageFilterComponent = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	// récupération des données des filtres depuis le store
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);

	// définition de la fonction qui permet de gérer le changement d'état des checkboxs
	function handleChangeCheckbox(checked: boolean, name: string) {
		const newLanguageFiltersObject = {
			...userFilters,
			[name]: !checked,
		};
		setUserFilters(newLanguageFiltersObject);
	}

	return (
		<div>
			<div>
				<input
					key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
					type="checkbox"
					id="greek"
					name="greek"
					checked={!userFilters.greek}
					onChange={(event) =>
						handleChangeCheckbox(event.target.checked, event.target.name)
					}
				/>
				<label htmlFor="greek">{translation[language].common.greek}</label>
			</div>
			<div>
				<input
					key={isReset.toString()} // permet d'effectuer un re-render au reset des filtres
					type="checkbox"
					id="semitic"
					name="semitic"
					checked={!userFilters.semitic}
					onChange={(event) =>
						handleChangeCheckbox(event.target.checked, event.target.name)
					}
				/>
				<label htmlFor="semitic">{translation[language].common.semitic}</label>
			</div>
		</div>
	);
};

export default LanguageFilterComponent;
