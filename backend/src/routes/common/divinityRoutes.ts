// import des bibiliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../controllers/builtMap/dcartControllers";

export const divinityRoutes = express.Router();

// récupère la liste des identifiants de divinités
divinityRoutes.get("/all", dcartControllers.getAllDivinityIds);

// modifier la liste des divinités
divinityRoutes.put("/", dcartControllers.updateDivinityIds);
