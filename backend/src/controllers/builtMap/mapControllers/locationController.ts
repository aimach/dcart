// import des services
import { mapDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const locationController = {
	// récupérer toutes les localisations en fonction du niveau
	getAllLocations: async (req: Request, res: Response): Promise<void> => {
		try {
			const { locationLevel } = req.params;

			if (locationLevel === "") {
				res.status(400).json({
					message: "Le niveau de localisation n'est pas valide.",
				});
				return;
			}

			let tableName = "";
			switch (locationLevel) {
				case "greatRegion":
					tableName = "grande_region";
					break;
				case "subRegion":
					tableName = "sous_region";
					break;
				case "location":
					tableName = "";
					break;
				default:
					tableName = "grande_region";
					break;
			}

			const results = await mapDataSource.query(
				`SELECT id, nom_fr, nom_en FROM ${tableName} ORDER BY nom_fr ASC`,
			);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// récupérer toutes les grandes regions ou une grande region spécifique
	getAllGreatRegions: async (req: Request, res: Response): Promise<void> => {
		try {
			if (req.params.greatRegionId === "all") {
				const results = await mapDataSource.query(
					"SELECT id, nom_fr, nom_en FROM grande_region",
				);
				res.status(200).json(results);
				return;
			}
			const results = await mapDataSource.query(
				"SELECT id, nom_fr, nom_en FROM grande_region WHERE id = $1",
				[req.params.greatRegionId],
			);
			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// récupérer toutes les sous-regions d'une grande region
	getAllSubRegionsFromGreatRegionId: async (
		req: Request,
		res: Response,
	): Promise<void> => {
		try {
			if (req.params.greatRegionId === "all") {
				const results = await mapDataSource.query(
					"SELECT id, nom_fr, nom_en FROM sous_region ORDER BY nom_fr ASC",
				);

				res.status(200).json(results);
			} else {
				const results = await mapDataSource.query(
					"SELECT id, nom_fr, nom_en FROM sous_region WHERE grande_region_id = $1 ORDER BY nom_fr ASC",
					[req.params.greatRegionId],
				);

				res.status(200).json(results);
			}
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
