// import des bibliothèques
import express from "express";
// import des modules

import { languageController } from "../../controllers/storymap/languageController";

export const languageRoutes = express.Router();

// récupère tous les languages disponibles pour les storymaps
languageRoutes.get("/:id", languageController.getStorymapLanguages);
