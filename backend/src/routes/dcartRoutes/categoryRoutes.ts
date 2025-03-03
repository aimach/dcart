// import des bibiliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../controllers/dcartControllers";

export const categoryRoutes = express.Router();

// récupère toutes les catégories ou une catégorie en particulier
categoryRoutes.get("/:categoryId", dcartControllers.getCategories);

// récupère toutes les catégories avec les cartes associées
categoryRoutes.get(
	"/:categoryId/maps",
	dcartControllers.getAllCategoriesWithMaps,
);
