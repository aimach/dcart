// import des bibiliothèques
import express from "express";
// import des controllers
import { mapController } from "../../../controllers/builtMap/mapControllers";

export const elementRoutes = express.Router();

// récupérer les divinités
elementRoutes.get("/divinities/all", mapController.getAllDivinities);
