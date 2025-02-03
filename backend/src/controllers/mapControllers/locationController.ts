// import des services
import { MapDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const locationController = {
	getAllGreatRegions: async (req: Request, res: Response): Promise<void> => {
		try {
			const results = await MapDataSource.query(
				"SELECT id, nom_fr, nom_en FROM grande_region",
			);

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
