// import des entités
import { Color } from "../../../entities/common/Color";
// import des services
import { dcartDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const colorController = {
	// récupère toutes les couleurs ou une couleur en particulier
	getColors: async (req: Request, res: Response): Promise<void> => {
		try {
			const { colorId } = req.params;

			let results = null;
			if (colorId === "all") {
				results = await dcartDataSource.getRepository(Color).find();

				res.status(200).json(results);
				return;
			}

			results = await dcartDataSource
				.getRepository(Color)
				.findOneBy({ id: colorId });

			if (!results) {
				res.status(404).json("Aucune couleur trouvée");
			}

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
