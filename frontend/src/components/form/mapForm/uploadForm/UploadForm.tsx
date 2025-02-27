// import des bibliothèques
import { useContext } from "react";
import { parse } from "papaparse";
// import des composants
import NavigationButtonComponent from "../navigationButton/NavigationButtonComponent";
// import du context
import { TranslationContext } from "../../../../context/TranslationContext";
// import des services
import { useMapFormStore } from "../../../../utils/stores/mapFormStore";
import { useShallow } from "zustand/shallow";
import { getAllAttestationsIdsFromParsedPoints } from "../../../../utils/functions/map";
// import des types
import type { ChangeEvent, FormEventHandler } from "react";
import type { ParseResult } from "papaparse";
import type {
	MapInfoType,
	ParsedPointType,
} from "../../../../utils/types/mapTypes";
// import du style
import style from "../demoCommonForm/demoCommonForm.module.scss";

const UploadForm = () => {
	// on récupère la langue
	const { translation, language } = useContext(TranslationContext);

	// on récupère les données du formulaire
	const { mapInfos, setMapInfos, step, setStep } = useMapFormStore(
		useShallow((state) => state),
	);

	// on gère l'upload du csv
	const handleFileUpload = (event: ChangeEvent) => {
		// on définit la correspondance avec les headers du csv
		const headerMapping: { [key: string]: string } = {
			Langues: "language",
			"Post Quem": "post_quem",
			"Ante Quem": "ante_quem",
			Région: "great_region",
			"Sous-région": "sub_region",
			Latitude: "latitude",
			Longitude: "longitude",
			Formule: "formula",
			ID: "id",
		};
		// on récupère le fichier
		const file = (event.target as HTMLInputElement).files?.[0];

		// s'il existe bien un fichier, on le parse et on stocke les points dans un state
		if (file) {
			// @ts-ignore : on ignore l'erreur de type car on sait que le fichier est bien de type File (problème de typage avec l'utilisation de l'option skipFirstNLines)
			parse(file, {
				header: true,
				transformHeader: (header) => headerMapping[header] || header,
				skipEmptyLines: true,
				dynamicTyping: true, // permet d'avoir les chiffres et booléens en tant que tels
				skipFirstNLines: 2,
				complete: (result: ParseResult<ParsedPointType>) => {
					const allAttestationsIds = getAllAttestationsIdsFromParsedPoints(
						result.data,
					);
					setMapInfos({
						...mapInfos,
						attestationIds: allAttestationsIds,
					} as MapInfoType);
				},
				error: (error) => {
					console.error("Erreur lors de la lecture du fichier :", error);
				},
			});
		}
	};

	// on gère la soumission du formulaire
	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		try {
			setStep(3);
		} catch (error) {
			console.error("Erreur lors de la soumission du formulaire :", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className={style.commonFormContainer}>
			<h4>{translation[language].backoffice.mapFormPage.addMapPoints}</h4>
			<div className={style.commonFormInputContainer}>
				<label htmlFor="points">
					{translation[language].backoffice.mapFormPage.uploadPoints}
				</label>
				<input
					id="point"
					type="file"
					accept=".csv"
					onChange={handleFileUpload}
				/>
			</div>
			<NavigationButtonComponent step={step} />
		</form>
	);
};

export default UploadForm;
