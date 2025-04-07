// import des bibliothèques
// import des composants
// import du context
// import des services
// import des types
// import du style
import { useTranslation } from "../../../../utils/hooks/useTranslation";
import { useMapFormStore } from "../../../../utils/stores/builtMap/mapFormStore";
import style from "../introForm/introForm.module.scss";
import { updateMapFilterOptions } from "../../../../utils/api/builtMap/putRequests";

const BuiltElementFilterForm = () => {
	const { translation, language } = useTranslation();

	const { mapInfos, mapFiltersOptions, setMapFiltersOptions } =
		useMapFormStore();

	const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMapFiltersOptions({
			...mapFiltersOptions,
			[event.target.name]: event.target.id,
		});
		// requête de modification du filtre
		updateMapFilterOptions(mapInfos?.id as string, "element", event.target.id);
	};

	return (
		<form className={style.commonFormContainer}>
			{/* <h4>{translation[language].backoffice.mapFormPage.addFilters}</h4> */}
			<h4>Construction du filtre "Elements"</h4>
			<div className={style.commonFormInputContainer}>
				<div className={style.labelContainer}>
					<label htmlFor="basic">Basique</label>
					<p>
						Le filtre "Elements" se présentera sous la forme d'un select/options
						où l'utilisateur pourra parcourir la liste des options et en choisir
						une ou plusieurs.
					</p>
				</div>
				<div className={style.inputContainer}>
					<input
						id="basic"
						name="element"
						type="radio"
						onChange={(event) => handleRadioChange(event)}
						checked={mapFiltersOptions.element === "basic"}
					/>
				</div>
			</div>
			<div className={style.commonFormInputContainer}>
				<div className={style.labelContainer}>
					<label htmlFor="automatic">Automatique</label>
					<p>
						Le filtre "Elements" se présentera sous la forme de checkboxs à 2
						niveaux : un premier niveau avec les théonymes et un second avec les
						épithètes.
					</p>
				</div>
				<div className={style.inputContainer}>
					<input
						id="automatic"
						name="element"
						type="radio"
						onChange={(event) => handleRadioChange(event)}
						checked={mapFiltersOptions.element === "automatic"}
					/>
				</div>
			</div>
			<div className={style.commonFormInputContainer}>
				<div className={style.labelContainer}>
					<label htmlFor="manual">Manuelle</label>
					<p>
						Le filtre "Elements" se présentera sous la forme de checkboxs à 2
						niveaux : un premier niveau avec les théonymes et un second avec les
						épithètes. Ces deux niveaux sont à construire sur-mesure ci-dessous
					</p>
				</div>
				<div className={style.inputContainer}>
					<input
						id="manual"
						name="element"
						type="radio"
						onChange={(event) => handleRadioChange(event)}
						checked={mapFiltersOptions.element === "manual"}
					/>
				</div>
			</div>
		</form>
	);
};

export default BuiltElementFilterForm;
