// import des bibliothèques
import { useState } from "react";
import { parse } from "papaparse";
// import des composants
// import du context
// import des services
import { useMapFormStore } from "../../../../utils/stores/mapFormStore";
import { useShallow } from "zustand/shallow";
// import des types
import type { ChangeEvent } from "react";
import type { ParseResult } from "papaparse";
import type { ParsedPoint } from "../../../../utils/types/mapTypes";
// import du style
import style from "./uploadForm.module.scss";
import { getAllAttestationsIdsFromParsedPoints } from "../../../../utils/functions/functions";
import { all } from "axios";
import NavigationButtonComponent from "../navigationButton/NavigationButtonComponent";

const UploadForm = () => {
	// on récupère les données du formulaire
	const {
		mapInfos,
		setMapInfos,
		step,
		incrementStep,
		decrementStep,
		visualReady,
		setVisualReady,
	} = useMapFormStore(useShallow((state) => state));

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
			parse(file, {
				skipFirstNLines: 2,
				header: true,
				transformHeader: (header) => headerMapping[header] || header,
				skipEmptyLines: true,
				dynamicTyping: true, // permet d'avoir les chiffres et booléens en tant que tels
				complete: (result: ParseResult<ParsedPoint>) => {
					const allAttestationsIds = getAllAttestationsIdsFromParsedPoints(
						result.data,
					);
					setMapInfos({
						...mapInfos,
						attestationsIds: allAttestationsIds,
					});
				},
				error: (error) => {
					console.error("Erreur lors de la lecture du fichier :", error);
				},
			});
		}
	};

	return (
		<form>
			<label htmlFor="points">Charger les points</label>
			<input id="point" type="file" accept=".csv" onChange={handleFileUpload} />
			<NavigationButtonComponent step={step} />
		</form>
	);
};

export default UploadForm;
