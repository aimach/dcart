// import des entités
import { Tag } from "../../entities/common/Tag";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const tagController = {
	// récupère toutes les catégories ou une catégorie en particulier
	getTags: async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;

			if (id === "all") {
				if (req.query.isActive) {
					const allTags = await dcartDataSource
						.getRepository(Tag)
						.createQueryBuilder("tag")
						.leftJoinAndSelect("tag.storymaps", "storymaps")
						.where("storymaps.isActive = :isActive", { isActive: true })
						.getMany();
					res.status(200).send(allTags);
					return;
				}
				const allTags = await dcartDataSource
					.getRepository(Tag)
					.createQueryBuilder("tag")
					.leftJoinAndSelect("tag.storymaps", "storymaps")
					.orderBy("tag.name", "ASC")
					.getMany();
				res.status(200).send(allTags);
				return;
			}
			const tag = await dcartDataSource
				.getRepository(Tag)
				.findOne({ where: { id } });

			if (!tag) {
				res.status(404).send({ message: "Tag non trouvé" });
				return;
			}

			res.status(200).send(tag);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	getStorymapsByTag: async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;
			const isActive = req.query.isActive === "true";

			const tag = await dcartDataSource
				.getRepository(Tag)
				.createQueryBuilder("tag")
				.leftJoinAndSelect("tag.storymaps", "storymaps")
				.leftJoinAndSelect("storymaps.tags", "tags")
				.where("tag.id = :id", { id })
				.andWhere("storymaps.isActive = :isActive", { isActive })
				.getOne();

			if (!tag) {
				res.status(404).send({ message: "Tag non trouvé" });
				return;
			}

			res.status(200).send(tag.storymaps);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
