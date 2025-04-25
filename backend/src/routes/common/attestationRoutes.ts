// import des bibiliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../controllers/builtMap/dcartControllers";

export const attestationRoutes = express.Router();

// créer un jeu d'attestations
attestationRoutes.post("/", dcartControllers.createAttestationList);

// modifier un jeu d'attestations
attestationRoutes.put("/:id", dcartControllers.modifyAttestationList);

// supprimer un jeu d'attestations
attestationRoutes.delete("/:id", dcartControllers.deleteAttestationList);
