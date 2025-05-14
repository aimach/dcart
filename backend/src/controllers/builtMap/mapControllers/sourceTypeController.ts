// import des services
import { mapDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const sourceTypeController = {
	getAllSourceTypes: async (req: Request, res: Response): Promise<void> => {
		try {
			const query = `
			SELECT
				type_source.nom_fr AS type_fr, 
				type_source.nom_en AS type_en,
				categorie_source.nom_fr AS category_fr, 
				categorie_source.nom_en AS category_en
			FROM type_source
			LEFT JOIN categorie_source 
			ON type_source.categorie_source_id = categorie_source.id`;
			const results = await mapDataSource.query(query);

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
