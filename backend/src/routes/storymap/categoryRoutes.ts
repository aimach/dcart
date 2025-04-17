// import des bibliothèques
import express from "express";
// import des controllers
import { categoryController } from "../../controllers/storymap/categoryController";

export const categoryRoutes = express.Router();

// récupère toutes les catégories ou une catégorie en particulier
categoryRoutes.get("/:id", categoryController.getCategories);
