// import des bibliothèques
import express from "express";
// import des controllers
import { sessionController } from "../controllers/session/SessionController";
import { authenticateUser } from "../middlewares/authenticate";

export const sessionRoutes = express.Router();

// récupération d'une session
sessionRoutes.get("/:itemId", authenticateUser, sessionController.getSession);

// création d'une session
sessionRoutes.post(
	"/:type/:itemId",
	authenticateUser,
	sessionController.createSession,
);

// mise à jour d'une session
sessionRoutes.put("/", authenticateUser, sessionController.updateSession);

// suppression d'une session
sessionRoutes.delete("/", authenticateUser, sessionController.deleteSession);

// vérifie qu'une session est en cours
sessionRoutes.post(
	"/ping",
	authenticateUser,
	sessionController.handleSessionPing,
);
