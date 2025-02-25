// import des bibliothèques
import { useState } from "react";
import { parse } from "papaparse";
// import des composants
// import du context
// import des services
// import des types
import type { ChangeEvent } from "react";
import type { ParseResult } from "papaparse";
// import du style
import style from "./downloadForm.module.scss";

const DownloadForm = () => {
	// on gère l'upload du csv
	const [parsedPoints, setParsedPoints] = useState<any[]>([]);

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
				complete: (result: ParseResult<any>) => {
					console.log(result.data);
					setParsedPoints(result.data);
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
		</form>
	);
};

export default DownloadForm;
