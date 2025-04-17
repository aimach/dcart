// import des bibiliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../../controllers/builtMap/dcartControllers";

export const tagRoutes = express.Router();

// récupère toutes les catégories ou une catégorie en particulier
tagRoutes.get("/:categoryId", dcartControllers.getTags);

// récupère toutes les catégories avec les cartes associées
tagRoutes.get("/:categoryId/maps", dcartControllers.getAllTagsWithMaps);
