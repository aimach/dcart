// import des services
import { MapDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const locationController = {
	getAllGreatRegions: async (req: Request, res: Response): Promise<void> => {
		if (req.params.greatRegionId === "all") {
			try {
				const results = await MapDataSource.query(
					"SELECT id, nom_fr, nom_en FROM grande_region",
				);

				res.status(200).json(results);
			} catch (error) {
				handleError(res, error as Error);
			}
		} else {
			try {
				const results = await MapDataSource.query(
					"SELECT id, nom_fr, nom_en FROM grande_region WHERE id = ?",
					[req.params.greatRegionId],
				);

				res.status(200).json(results);
			} catch (error) {
				handleError(res, error as Error);
			}
		}
	},

	getAllSubRegionsFromGreatRegionId: async (
		req: Request,
		res: Response,
	): Promise<void> => {
		try {
			console.log(req.params.greatRegionId);
			if (req.params.greatRegionId === "all") {
				const results = await MapDataSource.query(
					"SELECT id, nom_fr, nom_en FROM sous_region ORDER BY nom_fr ASC",
				);

				res.status(200).json(results);
			} else {
				const results = await MapDataSource.query(
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
