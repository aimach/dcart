// import des bibliothèques
import express from "express";
// import des modules
import { pointController } from "../../controllers/storymap/pointController";

export const pointRoutes = express.Router();

// crée de nouveaux points
pointRoutes.post("/:mapId", pointController.createNewPoints);

// supprime des points
pointRoutes.delete("/:mapId", pointController.deletePoints);
