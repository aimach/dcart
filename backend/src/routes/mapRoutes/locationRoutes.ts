// import des bibiliothèques
import express from "express";
import { mapController } from "../../controllers/mapControllers";

export const locationRoutes = express.Router();

// récupérer toutes les grandes regions
locationRoutes.get("/regions/all", mapController.getAllGreatRegions);
