// import des bibliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../../controllers/builtMap/dcartControllers";
// import des validateurs
import { validateMapContentBody } from "../../../utils/validator/builtMap/mapContent";
import { authenticateAdmin, authenticateUser } from "../../../middlewares/authenticate";

export const mapRoutes = express.Router();

// récupérer les données de toutes les cartes ou d'une carte en particulier
mapRoutes.get("/:mapId", dcartControllers.getMapContent);

// créer une nouvelle carte
mapRoutes.post(
	"/",
	validateMapContentBody,
	authenticateUser,
	dcartControllers.createMap,
);

// mettre à jour la carte
mapRoutes.put("/:mapId", authenticateUser, dcartControllers.updateMap);

// ajouter une storymap à une carte
mapRoutes.put(
	"/:mapId/relatedStorymap",
	authenticateUser,
	dcartControllers.updateStorymapLink,
);

// supprimer carte
mapRoutes.delete("/:mapId", authenticateUser, authenticateAdmin, dcartControllers.deleteMap);
