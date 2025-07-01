// import des bibliothèques
import { parse } from "papaparse";
// import des services
import { notifyError, notifyUploadSuccess } from "./toast";
// import des types
import type { ParseResult } from "papaparse";
import type { ChangeEvent } from "react";

type ParseCsvOptions = {
	event: ChangeEvent;
	onComplete: (result: ParseResult<{ id: string }>, panelSide?: string) => void;
	headerMapping?: Record<string, string>;
	skipLines?: number;
	onError?: () => void;
};

export const parseCSVFile = ({
	event,
	onComplete,
	onError,
	headerMapping = { ID: "id" },
	skipLines = 2,
}: ParseCsvOptions) => {
	const file = (event.target as HTMLInputElement).files?.[0];
	const panelSide = event.target.id;

	if (!file) return;

	parse(file, {
		header: true,
		transformHeader: (header) => headerMapping[header] || header,
		skipEmptyLines: true,
		dynamicTyping: true,
		skipFirstNLines: skipLines,
		complete: (result: ParseResult<{ id: string }>) => {
			if (result.data.length === 0) {
				notifyError("Le fichier est vide ou mal formaté");
				return;
			}
			onComplete(result, panelSide as string);
			notifyUploadSuccess("Points");
		},
		error: () => {
			if (onError) {
				onError();
			}
			notifyError("Erreur lors de la lecture du fichier");
		},
	});
};
