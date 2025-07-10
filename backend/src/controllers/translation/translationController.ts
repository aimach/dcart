// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { Translation } from "../../entities/builtMap/Translation";
import { NoContentText } from "../../entities/common/NoContentText";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const translationController = {
	// récupérer les objets de traduction ou une clé spécifique
	getTranslation: async (req: Request, res: Response): Promise<void> => {
		try {
			const { translationKey } = req.query;

			if (translationKey) {
				const translation = await dcartDataSource
					.getRepository(Translation)
					.findOne({ where: { key: translationKey as string } });

				res.status(200).send(translation);
				return;
			}

			const translations = await dcartDataSource
				.getRepository(Translation)
				.find({
					order: { key: "ASC" },
				});

			res.status(200).send(translations);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	getNoContentText: async (req: Request, res: Response): Promise<void> => {
		try {
			const randomNotFoundText = await dcartDataSource
				.getRepository(NoContentText)
				.createQueryBuilder("noContentText")
				.orderBy("RANDOM()")
				.limit(1)
				.getOne();

			res.status(200).send(randomNotFoundText);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// mettre à jour une clé de traduction
	updateTranslation: async (req: Request, res: Response): Promise<void> => {
		try {
			const { translationObjectId } = req.params;
			const { translationKey } = req.query;
			const { fr, en } = req.body;

			const safeKey = (translationKey as string).replace(/'/g, "''"); // échappe les éventuelles quotes simples dans la clé

			const translationObjectToUpdate = await dcartDataSource
				.getRepository(Translation)
				.findOne({ where: { id: translationObjectId, key: safeKey } });

			if (!translationObjectToUpdate) {
				res.status(404).send("Objet de traduction non trouvé");
				return;
			}

			// Mettre à jour les valeurs de la traduction
			translationObjectToUpdate.fr = fr;
			translationObjectToUpdate.en = en;

			await translationObjectToUpdate.save();

			res.status(200).send("Objet de traduction modifié");
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
