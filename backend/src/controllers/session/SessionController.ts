// import des entités
import { UpdateSession } from "../../entities/session/UpdateSession";
import { MapContent } from "../../entities/builtMap/MapContent";
import { Storymap } from "../../entities/storymap/Storymap";
// import des services
import { dcartDataSource } from "../../dataSource/dataSource";
import { handleError } from "../../utils/errorHandler/errorHandler";
// import des types
import type { Request, Response } from "express";
import type jwt from "jsonwebtoken";

// définition de la map des sessions actives
const activeSessions = new Map();

export const sessionController = {
	// récupération d'une session de modification
	getSession: async (req: Request, res: Response): Promise<void> => {
		try {
			const { itemId } = req.params;

			if (!itemId) {
				res.status(400).json({
					message: "L'id de la carte ou de la storymap est requis.",
				});
				return;
			}

			const session = await dcartDataSource
				.getRepository(UpdateSession)
				.findOne({ where: { itemId } });

			if (!session) {
				res.status(200).json({
					sessionExists: false,
					message: "Aucune session trouvée",
				});
				return;
			}

			res.status(200).json({
				sessionExists: true,
				message: "Session trouvée",
			});
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// création d'une session de modification
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

			const newSession = await dcartDataSource
				.getRepository(UpdateSession)
				.save({ user: userId, itemId });

			res.status(201).json(newSession);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// mise à jour d'une session de modification (suppression + création)
	updateSession: async (req: Request, res: Response): Promise<void> => {
		try {
			const { userId } = req.user as jwt.JwtPayload;

			const sessionToUpdate = await dcartDataSource
				.getRepository(UpdateSession)
				.findOne({ relations: ["user"], where: { user: { id: userId } } });

			if (!sessionToUpdate) {
				res.status(404).json({
					message: "Session non trouvée",
				});
				return;
			}

			// suppression
			await dcartDataSource
				.getRepository(UpdateSession)
				.delete({ user: userId });

			// création
			const updatedSession = await dcartDataSource
				.getRepository(UpdateSession)
				.save({ user: userId, itemId: sessionToUpdate.itemId });

			res.status(201).json(updatedSession);
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// suppression d'une session de création
	deleteSession: async (req: Request, res: Response): Promise<void> => {
		try {
			const { userId } = req.user as jwt.JwtPayload;

			await dcartDataSource
				.getRepository(UpdateSession)
				.delete({ user: userId });

			res.status(200).json({
				message: "Session supprimée",
			});
		} catch (error) {
			handleError(res, error as Error);
		}
	},

	// suppression des sessions inactives
	deleteInactiveSession: async (sessionId: string) => {
		await dcartDataSource
			.getRepository(UpdateSession)
			.delete({ id: sessionId });
	},

	// maintenir une session active
	handleSessionPing: async (req: Request, res: Response) => {
		const { sessionId } = req.body;

		if (!sessionId) {
			res.status(400).json({ message: "sessionId est requis" });
			return;
		}

		activeSessions.set(sessionId, Date.now());
		res.sendStatus(200);
	},

	// vérification des sessions inactives et suppression
	checkInactiveSessions: () => {
		const now = Date.now();
		activeSessions.forEach((lastPing, sessionId) => {
			if (now - lastPing > 60000) {
				// 1 minute sans ping
				sessionController.deleteInactiveSession(sessionId);
				activeSessions.delete(sessionId);
			}
		});
	},
};

// exécute la vérification des sessions toutes les 30s
setInterval(sessionController.checkInactiveSessions, 30000);
