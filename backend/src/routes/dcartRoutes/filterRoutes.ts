// import des bibiliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../controllers/dcartControllers";

export const filterRoutes = express.Router();

// récupère tous les filtres ou un filtre en particulier
filterRoutes.get("/:filterId", dcartControllers.getFilters);

// ajoute un ou des filtres à une carte
filterRoutes.post("/add/:mapId", dcartControllers.addFiltersToMap);
