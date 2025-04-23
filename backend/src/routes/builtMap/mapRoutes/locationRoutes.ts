// import des bibiliothèques
import express from "express";
import { mapController } from "../../../controllers/builtMap/mapControllers";

export const locationRoutes = express.Router();

// récupérer toutes les grandes regions
locationRoutes.get("/regions/:greatRegionId", mapController.getAllGreatRegions);

// récupérer toutes les sous-regions d'une grande region
locationRoutes.get(
	"/regions/:greatRegionId/subRegions",
	mapController.getAllSubRegionsFromGreatRegionId,
);

locationRoutes.get("/:locationLevel", mapController.getAllLocations);
