// import des services
import { mapDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const locationController = {
	// récupérer toutes les grandes regions ou une grande region spécifique
	getAllGreatRegions: async (req: Request, res: Response): Promise<void> => {
		try {
			if (req.params.greatRegionId === "all") {
				const results = await mapDataSource.query(
					"SELECT id, nom_fr, nom_en FROM grande_region ORDER BY nom_fr ASC",
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
