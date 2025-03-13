// import des bibliothèques
import express from "express";
// import des modules
import { storymapContentControllers } from "../../controllers/storymap/storymapContentController";
// import des validateurs
import {
	validateStorymapContentBody,
	validateStorymapContentToEditBody,
} from "../../utils/validator/storymap/storymapContent";
import { authenticateUser } from "../../middlewares/authenticate";

export const storymapContentRoutes = express.Router();

// récupère une storymap par son id
storymapContentRoutes.get("/:id", storymapContentControllers.getStorymapById);

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
	storymapContentControllers.deleteStorymap,
);
