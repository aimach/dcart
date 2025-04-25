// import des bibiliothèques
import express from "express";
// import des controllers
import { mapController } from "../../../controllers/builtMap/mapControllers";
// import des validateurs
import { validateSourceBody } from "../../../utils/validator/builtMap/source";

export const sourceRoutes = express.Router();

// récupérer les sources par l'id du block
sourceRoutes.get("/block/:blockId", mapController.getSourcesByBlockId);

// récupérer les attestations par l'id d'une source
sourceRoutes.get(
	"/:sourceId/attestations",
	mapController.getAttestationsBySourceId,
);

// récupérer les sources par l'id de la map
// NB : on utilise un POST car le payload peut être trop long pour un GET
sourceRoutes.post("/map/:mapSlug", mapController.getSourcesByMapId);

// récupérer les sources par la liste des attestations
// NB : on utilise un POST car le payload peut être trop long pour un GET
sourceRoutes.post(
	"/demo/attestations",
	validateSourceBody,
	mapController.getSourcesByAttestationIds,
);
