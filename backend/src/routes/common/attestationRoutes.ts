// import des bibiliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../controllers/builtMap/dcartControllers";
import { authenticateUser } from "../../middlewares/authenticate";

export const attestationRoutes = express.Router();

// créer un jeu d'attestations
attestationRoutes.post(
	"/",
	authenticateUser,
	dcartControllers.createAttestationList,
);

// modifier un jeu d'attestations
attestationRoutes.put(
	"/:id",
	authenticateUser,
	dcartControllers.modifyAttestationList,
);

// supprimer un jeu d'attestations
attestationRoutes.delete(
	"/:id",
	authenticateUser,
	dcartControllers.deleteAttestationList,
);
