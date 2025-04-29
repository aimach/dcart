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

			let translations = [];
			if (translationKey) {
				translations = await dcartDataSource
					.getRepository(Translation)
					.createQueryBuilder("translation")
					.select([
						"translation.id",
						"translation.language",
						`translation.translations->>'${translationKey}' as translation`,
					])
					.getRawMany();

				res.status(200).send(translations);
				return;
			}

			translations = await dcartDataSource
				.getRepository(Translation)
				.createQueryBuilder("translation")
				.select(["id", "language", "translations"])
				.getRawMany();

			res.status(200).send(translations);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	updateTranslation: async (req: Request, res: Response): Promise<void> => {
		try {
			const { translationObjectId } = req.params;
			const { translationKey } = req.query;
			const safeKey = (translationKey as string).replace(/'/g, "''"); // échappe les éventuelles quotes simples dans la clé
			const { translation } = req.body;

			await dcartDataSource
				.getRepository(Translation)
				.createQueryBuilder()
				.update("translation")
				.set({
					translations: () =>
						`translations || jsonb_build_object('${safeKey}', '${translation}')`,
				})
				.where("id = :id", {
					id: translationObjectId,
				})
				.execute();
			res.status(200).send("Objet de traduction modifié");
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
