// import des bibliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../../controllers/builtMap/dcartControllers";
// import des validateurs
import {
	validateNewMapContentBody,
	validateUpdatedMapContentBody,
} from "../../../utils/validator/builtMap/mapContent";
import {
	authenticateAdmin,
	authenticateUser,
} from "../../../middlewares/authenticate";

export const mapRoutes = express.Router();

// récupérer les données de toutes les cartes ou d'une carte en particulier par son id
mapRoutes.get("/id/:mapId", dcartControllers.getMapContent);

// récupérer les données de toutes les cartes ou d'une carte en particulier par son slug
mapRoutes.get("/slug/:mapSlug", dcartControllers.getMapContent);

// créer une nouvelle carte
mapRoutes.post(
	"/",
	validateNewMapContentBody,
	authenticateUser,
	dcartControllers.createMap,
);

// mettre à jour la carte
mapRoutes.put(
	"/:mapId",
	validateUpdatedMapContentBody,
	authenticateUser,
	dcartControllers.updateMap,
);

// supprimer carte
mapRoutes.delete(
	"/:mapId",
	authenticateUser,
	authenticateAdmin,
	dcartControllers.deleteMap,
);
