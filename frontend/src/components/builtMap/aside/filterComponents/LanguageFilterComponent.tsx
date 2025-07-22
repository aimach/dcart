// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFiltersStore } from "../../../../utils/stores/builtMap/mapFiltersStore";
import { useShallow } from "zustand/shallow";
import { useMapFilterOptionsStore } from "../../../../utils/stores/builtMap/mapFilterOptionsStore";

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

	const { initialSourceLanguageOptions, filteredSourceLanguageOptions } =
		useMapFilterOptionsStore();

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
					checked={!initialSourceLanguageOptions.greek && !userFilters.greek}
					onChange={(event) =>
						handleChangeCheckbox(event.target.checked, event.target.name)
					}
					disabled={
						initialSourceLanguageOptions.greek ||
						filteredSourceLanguageOptions.greek
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
					disabled={
						initialSourceLanguageOptions.semitic ||
						filteredSourceLanguageOptions.semitic
					}
				/>
				<label htmlFor="semitic">{translation[language].common.semitic}</label>
			</div>
		</div>
	);
};

export default LanguageFilterComponent;
