// import des services
import { MapDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const datationController = {
	getTimeMarkers: async (req: Request, res: Response): Promise<void> => {
		// récupérer dans la table datation le post_quem le plus bas et ante_quem le plus haut
		try {
			const query = `SELECT 
			MIN(post_quem) AS post_quem, 
			MAX(ante_quem) AS ante_quem 
			FROM datation`;
			const results = await MapDataSource.query(query);

			res.status(200).json(results[0]);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
