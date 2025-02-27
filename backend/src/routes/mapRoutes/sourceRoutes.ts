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

// récupérer les sources par la liste des attestations
// NB : on utilise un POST car le payload peut être trop long pour un GET
sourceRoutes.post(
	"/demo/attestations",
	mapController.getSourcesByAttestationIds,
);
