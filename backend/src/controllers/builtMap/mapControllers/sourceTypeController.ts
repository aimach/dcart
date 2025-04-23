// import des services
import { mapDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const sourceTypeController = {
	getAllSourceTypes: async (req: Request, res: Response): Promise<void> => {
		try {
			const query = `SELECT
			nom_fr, nom_en
			FROM type_source`;
			const results = await mapDataSource.query(query);

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
