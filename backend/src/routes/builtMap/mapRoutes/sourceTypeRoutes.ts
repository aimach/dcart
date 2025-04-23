// import des bibiliothèques
import express from "express";
// import des controllers
import { mapController } from "../../../controllers/builtMap/mapControllers";

export const sourceTypeRoutes = express.Router();

// récupérer les divinités
sourceTypeRoutes.get("/all", mapController.getAllSourceTypes);
