// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { Category } from "../../entities/builtMap/Category";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const categoryController = {
	// récupère toutes les catégories ou une catégorie en particulier
	getCategories: async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;

			if (id === "all") {
				const allCategories = await dcartDataSource
					.getRepository(Category)
					.find();
				res.status(200).send(allCategories);
				return;
			}
			const category = await dcartDataSource
				.getRepository(Category)
				.findOne({ where: { id } });

			if (!category) {
				res.status(404).send({ message: "Categorie non trouvée" });
				return;
			}

			res.status(200).send(category);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
