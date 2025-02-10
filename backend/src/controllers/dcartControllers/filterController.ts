// import des entités
import { Category } from "../../entities/Category";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";
import { Filter } from "../../entities/Filter";

export const filterController = {
	getAllFilters: async (req: Request, res: Response): Promise<void> => {
		try {
			const { filterId } = req.params;
			let results = null;
			if (filterId === "all") {
				results = await dcartDataSource.getRepository(Filter).find();
				res.status(200).json(results);
				return;
			}
			results = await dcartDataSource.getRepository(Filter).find({
				where: { id: filterId },
			});
			res.status(200).json(results[0]);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
