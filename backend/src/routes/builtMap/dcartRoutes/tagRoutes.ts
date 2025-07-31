// import des bibiliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../../controllers/builtMap/dcartControllers";
// import des middlewares
import {
	authenticateAdmin,
	authenticateUser,
} from "../../../middlewares/authenticate";

export const tagRoutes = express.Router();

// récupère toutes les catégories ou une catégorie en particulier
tagRoutes.get("/:tagSlug", dcartControllers.getTags);

// créée une nouvelle étiquette
tagRoutes.post(
	"/",
	authenticateUser,
	authenticateAdmin,
	dcartControllers.createTag,
);

// modifie une étiquette
tagRoutes.put(
	"/:tagId",
	authenticateUser,
	authenticateAdmin,
	dcartControllers.updateTag,
);

// supprime une étiquette
tagRoutes.delete(
	"/:tagId",
	authenticateUser,
	authenticateAdmin,
	dcartControllers.deleteTag,
);
