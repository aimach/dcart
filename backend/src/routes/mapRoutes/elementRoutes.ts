// import des bibiliothèques
import express from "express";
import { mapController } from "../../controllers/mapControllers";

export const elementRoutes = express.Router();

// récupérer les divinités
elementRoutes.get("/divinities/all", mapController.getAllDivinities);
