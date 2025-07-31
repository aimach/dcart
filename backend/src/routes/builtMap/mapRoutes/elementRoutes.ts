// import des bibiliothèques
import express from "express";
// import des controllers
import { mapController } from "../../../controllers/builtMap/mapControllers";

export const elementRoutes = express.Router();

// récupérer les divinités via une requête POST car on récupère la liste des identifiants définies dans la backoffice
elementRoutes.post("/divinities/all", mapController.getAllDivinities);
