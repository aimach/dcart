// import des bibliothèques
import express from "express";
// import des controllers
import { pointController } from "../../controllers/storymap/pointController";
// import des validateurs
import { authenticateUser } from "../../middlewares/authenticate";

export const pointRoutes = express.Router();

// crée de nouveaux points
pointRoutes.post("/:mapId", authenticateUser, pointController.createNewPoints);

// supprime des points
pointRoutes.delete("/:mapId", authenticateUser, pointController.deletePoints);
