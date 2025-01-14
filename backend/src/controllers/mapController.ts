// import des bibliothèques
import type { Request, Response } from "express";
// import des entités
// import des services
import { MapDataSource } from "../dataSource/dataSource";
import { getSourcesQuery } from "../utils/query/sourceQueryString";
// import des types

export const mapController = {
	// récupérer toutes les sources
	getSourcesByElementId: async (req: Request, res: Response): Promise<void> => {
		try {
			// récupérer la requête
			const queryLocalisation = "WHERE grande_region.id = 14";
			const sqlQuery = getSourcesQuery(
				"element",
				"",
				queryLocalisation,
				"",
				"",
				"",
			);

			// légende des paramètres : nombre d'éléments par attestation, id du théonyme/épithète, nombre de puissances divines
			const results = await MapDataSource.query(sqlQuery, [2, "{27}", 1]);
			res.status(200).json(results);
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({
					message: error.message,
					stack: error.stack,
					error: error,
				});
				return;
			}
			res.status(500).json({
				message: "Erreur inattendue",
				error: error,
			});
		}
	},
};
