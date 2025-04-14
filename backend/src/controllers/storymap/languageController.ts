// import des bibliothèques
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";
import { Language } from "../../entities/storymap/Language";

export const languageController = {
	// récupère tous les languages disponibles pour les storymaps
	getStorymapLanguages: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			if (id === "all") {
				const allLanguages = await dcartDataSource
					.getRepository(Language)
					.find();
				res.status(200).send(allLanguages);
				return;
			}

			const language = await dcartDataSource
				.getRepository(Language)
				.findOne({ where: { id } });

			if (!language) {
				res.status(404).send({ message: "Langue non trouvée" });
				return;
			}

			res.status(200).send(language);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
