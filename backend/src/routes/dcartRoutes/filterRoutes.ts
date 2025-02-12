// import des bibiliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../controllers/dcartControllers";

export const filterRoutes = express.Router();

filterRoutes.get("/:filterId", dcartControllers.getAllFilters);
