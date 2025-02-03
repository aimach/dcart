// import des bibiliothèques
import express from "express";
import { mapController } from "../../controllers/mapControllers";

export const datationRoutes = express.Router();

// récupérer les bornes temporelles
datationRoutes.get("/timeMarkers", mapController.getTimeMarkers);
