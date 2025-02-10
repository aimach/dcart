// import des bibiliothèques
import express from "express";
import { mapController } from "../../controllers/mapControllers";

export const sourceRoutes = express.Router();

// récupérer les sources par l'id de la map
sourceRoutes.get("/:mapId", mapController.getSourcesByMapId);

// récupérer les attestations d'une source
sourceRoutes.get(
	"/:sourceId/attestations",
	mapController.getAttestationsBySourceId,
);
