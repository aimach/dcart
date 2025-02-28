// import des entités
import { MapContent } from "../../entities/MapContent";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const mapContentController = {
	// récupérer les données de toutes les cartes ou d'une carte en particulier
	getMapContent: async (req: Request, res: Response): Promise<void> => {
		try {
			const { mapId } = req.params;

			if (mapId === "all") {
				const allMaps = await dcartDataSource
					.getRepository(MapContent)
					.find({ where: { isActive: true }, relations: ["filters"] });
				res.status(200).send(allMaps);
				return;
			}

			const mapInfos = await dcartDataSource
				.getRepository(MapContent)
				.find({ where: { id: mapId }, relations: ["filters"] });
			if (!mapInfos) {
				res.status(404).send({ Erreur: "Carte non trouvée" });
			} else {
				res.status(200).send(mapInfos[0]);
			}
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// créer une nouvelle carte
	createMap: async (req: Request, res: Response): Promise<void> => {
		try {
			const {
				name_en,
				name_fr,
				description_en,
				description_fr,
				categoryId,
				attestationIds,
			} = req.body;

			const newMap = dcartDataSource.getRepository(MapContent).create({
				name_en,
				name_fr,
				description_en,
				description_fr,
				category: categoryId,
				attestationIds,
			});

			await dcartDataSource.getRepository(MapContent).save(newMap);

			res.status(201).send(newMap);
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
