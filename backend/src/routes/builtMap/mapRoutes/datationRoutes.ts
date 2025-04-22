// import des bibiliothèques
import express from "express";
// import des controllers
import { mapController } from "../../../controllers/builtMap/mapControllers";

export const datationRoutes = express.Router();

// récupérer les bornes temporelles
datationRoutes.get("/timeMarkers", mapController.getTimeMarkers);
