// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { Translation } from "../../entities/builtMap/Translation";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const translationController = {
	getTranslation: async (req: Request, res: Response): Promise<void> => {
		try {
			const { translationKey } = req.query;
			console.log();
			let translations = [];
			if (translationKey) {
				translations = await dcartDataSource
					.getRepository(Translation)
					.createQueryBuilder("translation")
					.select([
						"translation.language",
						`translation.translations->>'${translationKey}' as translation`,
					])
					.getRawMany();

				res.status(200).json(translations);
			}

			translations = await dcartDataSource
				.getRepository(Translation)
				.createQueryBuilder("translation")
				.select(["language", "translations"])
				.getRawMany();

			res.status(200).json(translations);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
