// import des bibliothèques
import { useState } from "react";
import { parse } from "papaparse";
// import des composants
import NavigationButtonComponent from "../navigationButton/NavigationButtonComponent";
// import du context
import { useTranslation } from "../../../../utils/hooks/useTranslation";
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
import style from "../introForm/introForm.module.scss";

/**
 * Formulaire de la deuxième étape : upload de points sur la carte
 */
const UploadForm = () => {
	// récupération des données de la langue
	const { translation, language } = useTranslation();

	// récupération des données des stores
	const { mapInfos, setMapInfos, step, setStep } = useMapFormStore(
		useShallow((state) => state),
	);

	// définition d'un état pour afficher le bouton suivant si les points ont bien été uploadés
	const [nextButtonDisplayed, setNextButtonDisplayed] = useState(false);

	// fonction pour gérer l'upload du fichier
	const handleFileUpload = (event: ChangeEvent) => {
		// définition de la correspondance avec les headers du csv
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

		const file = (event.target as HTMLInputElement).files?.[0];

		// s'il existe bien un fichier, les données sont parsées et les points sont ajoutés à la carte de démonstration
		if (file) {
			// @ts-ignore : l'erreur de type sur File, le fichier est bien de type File (problème de typage avec l'utilisation de l'option skipFirstNLines)
			parse(file, {
				header: true,
				transformHeader: (header) => headerMapping[header] || header,
				skipEmptyLines: true,
				dynamicTyping: true, // option qui permet d'avoir les chiffres et booléens en tant que tels
				skipFirstNLines: 2,
				complete: (result: ParseResult<ParsedPointType>) => {
					// récupération des ids des attestations
					const allAttestationsIds = getAllAttestationsIdsFromParsedPoints(
						result.data,
					);
					// ajout des ids des attestations au store
					setMapInfos({
						...mapInfos,
						attestationIds: allAttestationsIds,
					} as MapInfoType);
					// affichage du bouton "Suivant"
					setNextButtonDisplayed(true);
				},
				error: (error) => {
					console.error("Erreur lors de la lecture du fichier :", error);
				},
			});
		}
	};

	// fonction pour gérer la soumission du formulaire (passage à l'étape suivante)
	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		setStep(3);
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
			<NavigationButtonComponent
				step={step}
				nextButtonDisplayed={nextButtonDisplayed}
			/>
		</form>
	);
};

export default UploadForm;
