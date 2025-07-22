// import des bibiliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../../controllers/builtMap/dcartControllers";
// import des validateurs
import { validateFilterBody } from "../../../utils/validator/builtMap/filter";
import { authenticateUser } from "../../../middlewares/authenticate";

export const filterRoutes = express.Router();

// récupère tous les filtres ou un filtre en particulier
filterRoutes.get("/:filterId", dcartControllers.getFilters);

// ajoute un ou des filtres à une carte
filterRoutes.post(
	"/add/:mapId",
	authenticateUser,
	validateFilterBody,
	dcartControllers.addFiltersToMap,
);

// modification d'un ou des filtres d'une carte
filterRoutes.put(
	"/update/:mapId",
	authenticateUser,
	validateFilterBody,
	dcartControllers.updateFiltersToMap,
);

// modification des options d'un filtre d'une carte
filterRoutes.put(
	"/update/:mapId/:filterType",
	authenticateUser,
	dcartControllers.updateFilterOptions,
);
