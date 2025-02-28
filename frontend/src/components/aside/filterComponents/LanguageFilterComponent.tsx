// import des bibliothèques
import { useContext } from "react";
// import du context
import { TranslationContext } from "../../../context/TranslationContext";
// import des services
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";
import { useShallow } from "zustand/shallow";

/**
 * Composant de filtre pour les langues (grec, sémitique)
 */
const LanguageFilterComponent = () => {
	// on récupère les données de langue
	const { translation, language } = useContext(TranslationContext);

	// on récupère les données des filtres depuis le store
	const { userFilters, setUserFilters, isReset } = useMapFiltersStore(
		useShallow((state) => state),
	);

	//on définit la fonction qui permet de gérer le changement d'état des checkboxs
	function handleChangeCheckbox(checked: boolean, name: string) {
		// modifier l'état de la checkbox
		const newLanguageFiltersObject = {
			...userFilters,
			[name]: checked,
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
					checked={userFilters.greek}
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
					checked={userFilters.semitic}
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
