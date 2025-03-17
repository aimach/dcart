// import des bibliothèques
import express from "express";
// import des modules
import { sessionController } from "../controllers/session/SessionController";
import { authenticateUser } from "../middlewares/authenticate";

export const sessionRoutes = express.Router();

// création d'une session
sessionRoutes.post(
	"/:type/:itemId",
	authenticateUser,
	sessionController.createSession,
);

// mise à jour d'une session
sessionRoutes.put(
	"/:type/:itemId",
	authenticateUser,
	sessionController.updateSession,
);

// suppression d'une session
sessionRoutes.delete(
	"/:itemId",
	authenticateUser,
	sessionController.deleteSession,
);
