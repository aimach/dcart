// import des entités
import { MapContent } from "../../entities/MapContent";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";

export const mapContentController = {
	getMapInformationsById: async (
		req: Request,
		res: Response,
	): Promise<void> => {
		try {
			const { mapId } = req.params;
			if (mapId === "all") {
				const MapInfos = await dcartDataSource
					.getRepository(MapContent)
					.find({ where: { isActive: true }, relations: ["filters"] });
				res.status(200).send(MapInfos);
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
};
