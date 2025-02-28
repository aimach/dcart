// import des services
import { mapDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const datationController = {
	// récupérer dans la table datation le post_quem le plus bas et ante_quem le plus haut
	getTimeMarkers: async (req: Request, res: Response): Promise<void> => {
		try {
			const query = `SELECT 
			MIN(post_quem) AS post, 
			MAX(ante_quem) AS ante 
			FROM datation`;
			const results = await mapDataSource.query(query);

			res.status(200).json(results[0]);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
