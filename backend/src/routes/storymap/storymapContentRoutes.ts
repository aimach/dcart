// import des bibliothèques
import express from "express";
// import des modules
import { storymapContentControllers } from "../../controllers/storymap/storymapContentController";

export const storymapContentRoutes = express.Router();

// récupère une storymap par son id
storymapContentRoutes.get("/:id", storymapContentControllers.getStorymapById);

// crée une nouvelle storymap
storymapContentRoutes.post("/", storymapContentControllers.createNewStorymap);

// met à jour une storymap
storymapContentRoutes.put(
	"/:storymapId",
	storymapContentControllers.updateStorymap,
);
