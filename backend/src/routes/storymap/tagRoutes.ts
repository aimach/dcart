// import des bibliothèques
import express from "express";
// import des controllers
import { tagController } from "../../controllers/storymap/tagController";

export const tagRoutes = express.Router();

// récupère toutes les catégories ou une catégorie en particulier
tagRoutes.get("/:id", tagController.getTags);
