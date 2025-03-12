// import des bibliothèques
import express from "express";
// import des modules
import { pointController } from "../../controllers/storymap/pointController";
// import des validateurs
import { validatePointsBody } from "../../utils/validator/storymap/point";

export const pointRoutes = express.Router();

// crée de nouveaux points
pointRoutes.post(
	"/:mapId",
	validatePointsBody,
	pointController.createNewPoints,
);

// supprime des points
pointRoutes.delete("/:mapId", pointController.deletePoints);
