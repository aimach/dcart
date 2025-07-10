// import des bibliothèques
import express from "express";
// import des controllers
import { translationController } from "../controllers/translation/translationController";
import {
	authenticateAdmin,
	authenticateUser,
} from "../middlewares/authenticate";

export const translationRoutes = express.Router();

// récupération d'un élément de traduction
translationRoutes.get("/", translationController.getTranslation);

translationRoutes.get("/no-content", translationController.getNoContentText);

// modification d'une clé de traduction
translationRoutes.put(
	"/:translationObjectId",
	authenticateUser,
	authenticateAdmin,
	translationController.updateTranslation,
);
