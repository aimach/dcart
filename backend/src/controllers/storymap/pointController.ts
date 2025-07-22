// import des entités
import { Storymap } from "../../entities/storymap/Storymap";
import { Block } from "../../entities/storymap/Block";
import { Point } from "../../entities/storymap/Point";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";
import type { pane } from "../../entities/storymap/Point";
import type { PointType } from "../../utils/types/storymapTypes";

export const pointController = {
	// crée de nouveaux points
	createNewPoints: async (req: Request, res: Response): Promise<void> => {
		try {
			const points = req.body.parsedPoints as PointType[];
			const blockId = req.params.mapId;

			if (!points || points.length === 0) {
				res.status(400).send("Aucune donnée reçue");
				return;
			}

			const block = await dcartDataSource
				.getRepository(Block)
				.findOne({ where: { id: blockId as string }, relations: ["storymap"] });

			if (!block) {
				res.status(404).send("Bloc de type carte non trouvé");
				return;
			}

			// on filtre les points qui n'ont pas de latitude, longitude
			const filteredPoints = points.filter(
				(point) => point.latitude && point.longitude,
			);

			// on ajoute le blockId à tous les points
			const filteredPointsWithBlockId = filteredPoints.map((point) => {
				return { ...point, block: blockId };
			});

			const newPoints = filteredPointsWithBlockId.map(
				(point: Omit<PointType, "id">) => {
					return dcartDataSource.getRepository(Point).create(point);
				},
			);

			await dcartDataSource.getRepository(Point).save(newPoints);

			// mise à jour du champ lastUploadPointsDate dans la storymap
			const storymapToUpdate = await dcartDataSource
				.getRepository(Storymap)
				.findOne({
					where: { id: block.storymap.id },
				});

			if (!storymapToUpdate) {
				res.status(404).send("Storymap non trouvée");
				return;
			}

			storymapToUpdate.uploadPointsLastDate = new Date();
			await dcartDataSource.getRepository(Storymap).save(storymapToUpdate);

			res
				.status(201)
				.send(`${filteredPoints.length} données insérées avec succès !`);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// supprime des points
	deletePoints: async (req: Request, res: Response): Promise<void> => {
		const blockId = req.params.mapId;
		const pane = req.query.pane;

		if (!blockId) {
			res.status(400).send("Aucune donnée reçue");
			return;
		}

		const mapBlock = await dcartDataSource
			.getRepository(Block)
			.findOne({ where: { id: blockId as string }, relations: ["points"] });

		if (!mapBlock) {
			res.status(404).send("Carte non trouvée");
			return;
		}

		// s'il y a un panneau dans les paramètres, on supprime les points de ce panneau
		if (pane) {
			await dcartDataSource
				.getRepository(Point)
				// @ts-ignore
				.delete({ block: mapBlock, pane: pane as pane });
			res.status(200).send("Données supprimées avec succès !");
			return;
		}

		// sinon, on les supprime tous
		// @ts-ignore
		await dcartDataSource.getRepository(Point).delete({ block: mapBlock });

		res.status(200).send("Données supprimées avec succès !");
	},
};
