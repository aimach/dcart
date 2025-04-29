// import des bibliothèques
import express from "express";
// import des controllers
import { translationController } from "../controllers/translation/translationController";

export const translationRoutes = express.Router();

// récupération d'un élément de traduction
translationRoutes.get("/", translationController.getTranslation);

// modification d'une clé de traduction
translationRoutes.put(
	"/:translationObjectId",
	translationController.updateTranslation,
);
