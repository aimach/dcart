// import des bibliothèques
import express from "express";
// import des controllers
import { tagController } from "../../controllers/storymap/tagController";

export const tagRoutes = express.Router();

// récupère toutes les storymaps associées à une catégorie
tagRoutes.get("/:id/storymaps", tagController.getStorymapsByTag);
