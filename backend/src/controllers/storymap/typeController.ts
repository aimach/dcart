// import des bibliothèques
import { Not } from "typeorm";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { Type } from "../../entities/storymap/Type";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const typeController = {
	// récupère les types de blocs
	getBlockTypes: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			if (id === "all") {
				const allBlockTypes = await dcartDataSource
					.getRepository(Type)
					.findBy({ name: Not("step") });
				res.status(200).send(allBlockTypes);
				return;
			}

			const blockType = await dcartDataSource
				.getRepository(Type)
				.findOne({ where: { id } });

			if (!blockType) {
				res.status(404).send({ message: "Type non trouvé" });
				return;
			}

			res.status(200).send(blockType);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// récupère un type de bloc par son nom
	getTypeInfosByName: async (req: Request, res: Response) => {
		try {
			const { typeName } = req.params;
			const blockInfos = await dcartDataSource
				.getRepository(Type)
				.findOne({ where: { name: typeName } });

			if (!blockInfos) {
				res.status(404).send({ message: "Type non trouvé" });
				return;
			}

			res.status(200).send(blockInfos);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
