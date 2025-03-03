// import des bibliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../controllers/dcartControllers";

export const mapRoutes = express.Router();

// récupérer les données de toutes les cartes ou d'une carte en particulier
mapRoutes.get("/:mapId", dcartControllers.getMapContent);

// créer une nouvelle carte
mapRoutes.post("/", dcartControllers.createMap);
