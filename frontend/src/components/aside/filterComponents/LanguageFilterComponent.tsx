// import des bibliothèques
import { useContext } from "react";
// import des composants
// import du context
import { TranslationContext } from "../../../context/TranslationContext";

// import des services
import { useMapFiltersStore } from "../../../utils/stores/mapFiltersStore";
import { useShallow } from "zustand/shallow";
// import des types
// import du style
import style from "./filtersComponent.module.scss";

const LanguageFilterComponent = () => {
	// on récupère les données de langue
	const { translation, language } = useContext(TranslationContext);

	// on récupère les données des filtres depuis le store
	const { userFilters, setUserFilters } = useMapFiltersStore(
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
		<>
			<div>
				<input
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
		</>
	);
};

export default LanguageFilterComponent;
