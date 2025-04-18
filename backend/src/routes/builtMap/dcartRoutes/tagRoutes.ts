// import des bibiliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../../controllers/builtMap/dcartControllers";

export const tagRoutes = express.Router();

// récupère toutes les catégories ou une catégorie en particulier
tagRoutes.get("/:tagId", dcartControllers.getTags);

// récupère toutes les catégories avec les cartes associées
tagRoutes.get("/:tagId/maps", dcartControllers.getAllTagsWithMaps);
