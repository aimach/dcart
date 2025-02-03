// import des services
import { MapDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const elementController = {
	getAllDivinities: async (req: Request, res: Response): Promise<void> => {
		// récupérer la liste d'alaya
		try {
			const query = `SELECT
			element.id AS id,
			traduction.nom_fr AS nom_fr,
			traduction.nom_en AS nom_en
			FROM element
			LEFT JOIN
			(SELECT id_element, MIN(nom_fr) AS nom_fr, MIN(nom_en) AS nom_en FROM traduction_element GROUP BY id_element) 
			traduction ON element.id = traduction.id_element
			JOIN nature_element ON element.id_nature_element = nature_element.id
			WHERE nature_element.nom_fr LIKE $1
			ORDER BY element.id
			`;
			const results = await MapDataSource.query(query, ["%Substantif%"]);

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
