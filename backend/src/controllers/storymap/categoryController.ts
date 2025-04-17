// import des entités
import { Category } from "../../entities/common/Category";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const categoryController = {
	// récupère toutes les catégories ou une catégorie en particulier
	getCategories: async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;

			if (id === "all") {
				if (req.query.isActive) {
					const allCategories = await dcartDataSource
						.getRepository(Category)
						.createQueryBuilder("category")
						.leftJoinAndSelect("category.storymaps", "storymaps")
						.where("storymaps.isActive = :isActive", { isActive: true })
						.getMany();
					res.status(200).send(allCategories);
					return;
				}
				const allCategories = await dcartDataSource
					.getRepository(Category)
					.createQueryBuilder("category")
					.leftJoinAndSelect("category.storymaps", "storymaps")
					.getMany();
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
