// import des bibliothèques
import express from "express";
// import des modules
import { mapController } from "../controllers/mapController";

export const mapRouter = express.Router();

// récupérer les données d'une carte
mapRouter.get("/:mapId", mapController.getMapInformationsById);

// récupérer les sources par l'id de la map
mapRouter.get("/:mapId/sources", mapController.getSourcesByMapId);

// récupérer les sources par élément id
// mapRouter.get("/sources/:elementId", mapController.getSourcesByElementId);
