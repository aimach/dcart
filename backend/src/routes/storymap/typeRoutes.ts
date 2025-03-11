// import des bibliothèques
import express from "express";
// import des modules
import { typeController } from "../../controllers/storymap/typeController";

export const typeRoutes = express.Router();

// récupère tous les types de blocs ou un type de bloc en particulier
typeRoutes.get("/:id", typeController.getBlockTypes);

// récupère un type de bloc par son nom
typeRoutes.get("/names/:typeName", typeController.getTypeInfosByName);
