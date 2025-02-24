// import des bibiliothèques
import express from "express";
// import des controllers
import { dcartControllers } from "../../controllers/dcartControllers";

export const categoryRoutes = express.Router();

categoryRoutes.get("/:categoryId", dcartControllers.getAllCategories);

categoryRoutes.get(
	"/:categoryId/maps",
	dcartControllers.getAllCategoriesWithMaps,
);
