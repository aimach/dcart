// import des bibiliothèques
import express from "express";
import { dcartControllers } from "../../controllers/dcartControllers";

export const categoryRoutes = express.Router();

categoryRoutes.get("/all", dcartControllers.getAllCategoriesWithMaps);
