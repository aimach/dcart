// import des entités
import { Icon } from "../../entities/common/Icon";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const iconController = {
	// récupère toutes les icones ou une icone en particulier
	getIcons: async (req: Request, res: Response): Promise<void> => {
		try {
			const { iconId } = req.params;

			let results = null;
			if (iconId === "all") {
				results = await dcartDataSource.getRepository(Icon).find();

				res.status(200).json(results);
				return;
			}

			results = await dcartDataSource
				.getRepository(Icon)
				.findOneBy({ id: iconId });

			if (!results) {
				res.status(404).json("Aucune icône trouvée");
			}

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
