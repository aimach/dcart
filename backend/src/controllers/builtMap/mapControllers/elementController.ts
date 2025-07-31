// import des services
import { mapDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const elementController = {
  getAllDivinities: async (req: Request, res: Response): Promise<void> => {
    try {
      const { divinityIds } = req.body;
      const divinityFilter = divinityIds
        ? `AND element.id IN (${divinityIds})`
        : "";

      // ajouter un filtre pour ne récupérer que les divinités dont les identifiants sont dans la liste
      const query = `SELECT
			element.id AS id,
			element.etat_absolu AS etat_absolu,
			traduction.nom_fr AS nom_fr,
			traduction.nom_en AS nom_en
			FROM element
			LEFT JOIN
			(SELECT id_element, MIN(nom_fr) AS nom_fr, MIN(nom_en) AS nom_en FROM traduction_element GROUP BY id_element) 
			traduction ON element.id = traduction.id_element
			WHERE traduction.nom_fr IS NOT NULL
			AND traduction.nom_en IS NOT NULL
			${divinityFilter}
			ORDER BY traduction.nom_fr ASC, traduction.nom_en ASC
			`;
      const results = await mapDataSource.query(query);

      res.status(200).json(results);
    } catch (error) {
      handleError(res, error as Error);
    }
  },
};
