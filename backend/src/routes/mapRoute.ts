// import des bibliothèques
import express from "express";
// import des modules
import { mapController } from "../controllers/mapControllers";
import { dcartControllers } from "../controllers/dcartControllers";

export const mapRouter = express.Router();

// récupérer les données d'une carte
mapRouter.get("/:mapId", dcartControllers.getMapInformationsById);

// récupérer les sources par l'id de la map
mapRouter.get("/:mapId/sources", mapController.getSourcesByMapId);

// récupérer les grandes régions
mapRouter.get("/db/regions", mapController.getAllGreatRegions);

// récupérer les divinités
mapRouter.get("/db/divinities", mapController.getAllDivinities);

// récupérer les bornes temporelles
mapRouter.get("/db/timeMarkers", mapController.getTimeMarkers);

// récupérer les sources par élément id
// mapRouter.get("/sources/:elementId", mapController.getSourcesByElementId);
