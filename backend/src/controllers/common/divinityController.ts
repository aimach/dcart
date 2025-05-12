// import des entités
import { Color } from "../../entities/common/Color";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";
import { Divinity } from "../../entities/common/Divinity";

export const divinityController = {
	// récupère tous les ids des divinités
	getAllDivinityIds: async (req: Request, res: Response): Promise<void> => {
		try {
			const result = await dcartDataSource
				.getRepository(Divinity)
				.findOneBy({ id: 1 });

			if (!result) {
				res.status(404).json("Aucune liste des divinités trouvée");
				return;
			}

			res.status(200).json(result.divinity_list);
			return;
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// modifie les ids des divinités
	updateDivinityIds: async (req: Request, res: Response): Promise<void> => {
		try {
			const { divinity_list } = req.body;

			if (!divinity_list) {
				res.status(400).json("Aucune liste des divinités trouvée");
				return;
			}

			const divinityListInDB = await dcartDataSource
				.getRepository(Divinity)
				.findOneBy({ id: 1 });
			if (!divinityListInDB) {
				res.status(404).json("Aucune liste des divinités trouvée");
				return;
			}
			divinityListInDB.divinity_list = divinity_list;
			await dcartDataSource.getRepository(Divinity).save(divinityListInDB);
			res.status(201).json("Liste des divinités modifiée");
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
