// import des bibliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../../controllers/builtMap/dcartControllers";
// import des validateurs
import { validateMapContentBody } from "../../../utils/validator/mapContent";

export const mapRoutes = express.Router();

// récupérer les données de toutes les cartes ou d'une carte en particulier
mapRoutes.get("/:mapId", dcartControllers.getMapContent);

// créer une nouvelle carte
mapRoutes.post("/", validateMapContentBody, dcartControllers.createMap);
