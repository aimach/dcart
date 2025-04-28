// import des bibliothèques
import express from "express";
// import des controllers
import { storymapContentControllers } from "../../controllers/storymap/storymapContentController";
// import des validateurs
import {
	validateStorymapContentBody,
	validateStorymapContentToEditBody,
} from "../../utils/validator/storymap/storymapContent";
import {
	authenticateAdmin,
	authenticateUser,
} from "../../middlewares/authenticate";

export const storymapContentRoutes = express.Router();

// récupère une storymap par son id
storymapContentRoutes.get(
	"/id/:id",
	storymapContentControllers.getStorymapInfos,
);

// récupère une storymap par son slug
storymapContentRoutes.get(
	"/slug/:slug",
	storymapContentControllers.getStorymapInfos,
);

// crée une nouvelle storymap
storymapContentRoutes.post(
	"/",
	authenticateUser,
	validateStorymapContentBody,
	storymapContentControllers.createNewStorymap,
);

// met à jour une storymap
storymapContentRoutes.put(
	"/:storymapId",
	authenticateUser,
	validateStorymapContentToEditBody,
	storymapContentControllers.updateStorymap,
);

// supprime une storymap
storymapContentRoutes.delete(
	"/:storymapId",
	authenticateUser,
	authenticateAdmin,
	storymapContentControllers.deleteStorymap,
);
