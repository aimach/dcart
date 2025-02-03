// import des entités
import { Category } from "../../entities/Category";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const categoryController = {
	getAllCategoriesWithMaps: async (
		req: Request,
		res: Response,
	): Promise<void> => {
		try {
			const { categoryId } = req.params;
			let results = null;
			if (categoryId === "all") {
				results = await dcartDataSource.getRepository(Category).find({
					select: { maps: { id: true, name_fr: true, name_en: true } },
					relations: { maps: true },
				});
				res.status(200).json(results);
			} else {
				results = await dcartDataSource.getRepository(Category).find({
					select: { maps: { id: true, name_fr: true, name_en: true } },
					relations: { maps: true },
					where: { id: categoryId },
				});
				res.status(200).json(results[0]);
			}
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
