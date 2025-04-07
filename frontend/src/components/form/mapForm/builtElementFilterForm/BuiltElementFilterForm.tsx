// import des bibliothèques
// import des composants
// import du context
// import des services
// import des types
// import du style
import { useTranslation } from "../../../../utils/hooks/useTranslation";
import style from "../introForm/introForm.module.scss";

const BuiltElementFilterForm = () => {
	const { translation, language } = useTranslation();

	const handleSubmit = () => {
		console.log("Form submitted");
	};

	const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { checked } = event.target;
		console.log("Checkbox checked:", checked);
		// Handle the checkbox change logic here
	};

	return (
		<form onSubmit={handleSubmit} className={style.commonFormContainer}>
			{/* <h4>{translation[language].backoffice.mapFormPage.addFilters}</h4> */}
			<h4>Construction du filtre "Elements"</h4>
			<div className={style.commonFormInputContainer}>
				<div className={style.labelContainer}>
					<label htmlFor="automatic">Automatique</label>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
						dignissimos, suscipit beatae, soluta accusamus, et voluptatem velit
						officiis facilis ratione mollitia sed repudiandae? Eum vel tenetur,
						dolores quasi vitae perferendis!
					</p>
				</div>
				<div className={style.inputContainer}>
					<input
						id="automatic"
						name="builtSolution"
						type="radio"
						checked=""
						onChange={(event) => handleRadioChange(event)}
					/>
				</div>
			</div>
			<div className={style.commonFormInputContainer}>
				<div className={style.labelContainer}>
					<label htmlFor="manual">Manuelle</label>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
						dignissimos, suscipit beatae, soluta accusamus, et voluptatem velit
						officiis facilis ratione mollitia sed repudiandae? Eum vel tenetur,
						dolores quasi vitae perferendis!
					</p>
				</div>
				<div className={style.inputContainer}>
					<input
						id="manual"
						name="builtSolution"
						type="radio"
						checked=""
						onChange={(event) => handleRadioChange(event)}
					/>
				</div>
			</div>
		</form>
	);
};

export default BuiltElementFilterForm;
