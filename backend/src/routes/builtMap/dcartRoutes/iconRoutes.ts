// import des bibiliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../../controllers/builtMap/dcartControllers";

export const iconRoutes = express.Router();

// récupère toutes les icônes ou une icône en particulier
iconRoutes.get("/:iconId", dcartControllers.getIcons);
