// import des bibiliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../../controllers/builtMap/dcartControllers";

export const attestationRoutes = express.Router();

// créer un jeu d'attestations
attestationRoutes.post("/", dcartControllers.createAttestationList);
