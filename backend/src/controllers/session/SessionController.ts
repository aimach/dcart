// import des entités
import { UpdateSession } from "../../entities/session/UpdateSession";
import { MapContent } from "../../entities/builtMap/MapContent";
import { Storymap } from "../../entities/storymap/Storymap";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
// import des types
import type { Request, Response } from "express";
import type jwt from "jsonwebtoken";
import { handleError } from "../../utils/errorHandler/errorHandler";

export const sessionController = {
	createSession: async (req: Request, res: Response): Promise<void> => {
		try {
			const { type, userId } = req.user as jwt.JwtPayload;

			const { itemId } = req.params;

			if (!itemId) {
				res.status(400).json({
					message: "L'id de la carte ou de la storymap est requis.",
				});
				return;
			}

			const repository =
				type === "storymap"
					? dcartDataSource.getRepository(Storymap)
					: dcartDataSource.getRepository(MapContent);

			const itemToSave = repository.findOne({ where: { id: itemId } });

			if (!itemToSave) {
				res.status(404).json({
					message: "Carte ou storymap non trouvé",
				});
				return;
			}

			await dcartDataSource
				.getRepository(UpdateSession)
				.save({ user: userId, itemId });

			res.status(201).json({
				message: "Session créée",
			});
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	updateSession: async (req: Request, res: Response): Promise<void> => {
		try {
			const { userId } = req.user as jwt.JwtPayload;

			const { type, itemId } = req.params;

			const sessionToUpdate = await dcartDataSource
				.getRepository(UpdateSession)
				.findOne({ where: { itemId } });

			if (!sessionToUpdate) {
				res.status(404).json({
					message: "Session non trouvée",
				});
				return;
			}

			const repository =
				type === "storymap"
					? dcartDataSource.getRepository(Storymap)
					: dcartDataSource.getRepository(MapContent);

			const itemToSave = repository.findOne({ where: { id: itemId } });

			if (!itemToSave) {
				res.status(404).json({
					message: "Carte ou storymap non trouvé",
				});
				return;
			}

			// suppression
			await dcartDataSource.getRepository(UpdateSession).delete({ itemId });

			// création
			await dcartDataSource
				.getRepository(UpdateSession)
				.save({ user: userId, itemId });

			res.status(201).json({
				message: "Session mise à jour",
			});
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	deleteSession: async (req: Request, res: Response): Promise<void> => {
		try {
			const { itemId } = req.params;

			if (!itemId) {
				res.status(400).json({
					message: "L'id de la carte ou de la storymap est requis.",
				});
				return;
			}

			await dcartDataSource.getRepository(UpdateSession).delete({ itemId });

			res.status(201).json({
				message: "Session supprimée",
			});
		} catch (error) {
			handleError(res, error as Error);
		}
	},
};
