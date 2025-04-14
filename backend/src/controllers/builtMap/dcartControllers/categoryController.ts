// import des entités
import { Category } from "../../../entities/common/Category";
// import des services
import { dcartDataSource } from "../../../dataSource/dataSource";
import { handleError } from "../../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const categoryController = {
	// récupère toutes les catégories ou une catégorie en particulier
	getCategories: async (req: Request, res: Response): Promise<void> => {
		try {
			const { categoryId } = req.params;

			let results = null;
			if (categoryId === "all") {
				results = await dcartDataSource.getRepository(Category).find();

				res.status(200).json(results);
				return;
			}

			results = await dcartDataSource
				.getRepository(Category)
				.findOneBy({ id: categoryId });

			if (!results) {
				res.status(404).json("Aucune catégorie trouvée");
			}

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// récupère toutes les catégories avec les cartes associées
	getAllCategoriesWithMaps: async (
		req: Request,
		res: Response,
	): Promise<void> => {
		try {
			const { categoryId } = req.params;

			let results = null;
			if (categoryId === "all") {
				results = await dcartDataSource
					.getRepository(Category)
					.createQueryBuilder("category")
					.innerJoin("category.maps", "map") // Exclure les catégories sans cartes
					.select([
						"category.id",
						"category.name_fr",
						"category.name_en",
						"category.description_fr",
						"category.description_en",
						"map.id",
						"map.title_fr",
						"map.title_en",
						"map.description_fr",
						"map.description_en",
					])
					.where("map.isActive = true") // Exclure les cartes inactives
					.getMany();

				res.status(200).json(results);
				return;
			}

			// on vérifie que la catégorie existe
			const category = await dcartDataSource
				.getRepository(Category)
				.findOneBy({ id: categoryId });

			if (!category) {
				res.status(404).json("Aucune catégorie trouvée");
				return;
			}

			results = await dcartDataSource
				.getRepository(Category)
				.createQueryBuilder("category")
				.innerJoin("category.maps", "map") // Exclure les catégories sans cartes
				.select([
					"category.id",
					"category.name_fr",
					"category.name_en",
					"category.description_fr",
					"category.description_en",
					"map.id",
					"map.title_fr",
					"map.title_en",
					"map.description_fr",
					"map.description_en",
				])
				.where({ id: categoryId })
				.getOne();

			res.status(200).json(results);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
