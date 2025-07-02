// import des bibliothèques
import { parse } from "papaparse";
// import des services
import { notifyError, notifyUploadSuccess } from "./toast";
// import des types
import type { ParseResult } from "papaparse";
import type { ChangeEvent } from "react";
import type { CustomPointType, PointSetType } from "../types/mapTypes";

type ParseCsvOptions = {
	event: ChangeEvent;
	onComplete: (
		result: ParseResult<{ id: string } | CustomPointType>,
		panelSide?: string,
	) => void;
	headerMapping?: Record<string, string>;
	skipLines?: number;
	onError?: () => void;
};

const parseCSVFile = ({
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
		complete: (result: ParseResult<{ id: string } | CustomPointType>) => {
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

const handleCSVDownload = async (
	pointSet: PointSetType,
	filename: string,
	type: "mapPoints" | "customPoints",
) => {
	if (!pointSet) {
		notifyError(
			"Il n'y a pas de points à télécharger. Veuillez d'abord charger un fichier CSV.",
		);
		return;
	}

	let headers: string[] = [];
	let rows: string[] = [];
	let csvContent = "";

	if (
		type === "customPoints" &&
		pointSet.customPointsArray &&
		pointSet.customPointsArray?.length > 0
	) {
		headers = Object.keys(
			(pointSet.customPointsArray as CustomPointType[])[0] || {},
		).filter((header) => !["id"].includes(header));
		rows = (pointSet.customPointsArray as CustomPointType[]).map((point) => {
			return headers.map((header) => point[header]).join(";");
		});
		csvContent = [headers.join(";"), ...rows].join("\n");
	}

	if (type === "mapPoints" && pointSet.attestationIds) {
		headers = ["ID"];
		rows = pointSet.attestationIds.split(",");
		csvContent = [
			"Bonnet C. (dir.), ERC Mapping Ancient Polytheisms 741182 (DB MAP), Toulouse 2017-2022 : https://base-map-polytheisms.huma-num.fr/.",
			"Attestations",
			headers.join(";"),
			...rows,
		].join("\n");
	}

	// Créer un blob CSV
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);

	// Créer un lien de téléchargement
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", filename);
	link.click();

	URL.revokeObjectURL(url);
};

export { parseCSVFile, handleCSVDownload };
