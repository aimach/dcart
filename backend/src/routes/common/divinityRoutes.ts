// import des bibiliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../controllers/builtMap/dcartControllers";

export const divinityRoutes = express.Router();

// récupère toutes les icônes ou une icône en particulier
divinityRoutes.get("/all", dcartControllers.getAllDivinityIds);
