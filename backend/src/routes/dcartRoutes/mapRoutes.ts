// import des bibliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../controllers/dcartControllers";

export const mapRoutes = express.Router();

// récupérer les données d'une carte
mapRoutes.get("/:mapId", dcartControllers.getMapInformationsById);

// créer une nouvelle carte
mapRoutes.post("/", dcartControllers.createMap);
