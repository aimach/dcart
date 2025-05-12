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
			const results = await dcartDataSource.getRepository(Divinity).find();

			if (!results) {
				res.status(404).json("Aucune liste des divinités trouvée");
				return;
			}

			res.status(200).json(results[0].divinity_list);
			return;
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
