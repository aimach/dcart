// import des bibliothèques
import express from "express";
// import des routes
import { categoryRoutes } from "./categoryRoutes";
import { mapRoutes } from "./mapRoutes";
import { filterRoutes } from "./filterRoutes";

const dcartRoutes = express.Router();

dcartRoutes.use("/categories", categoryRoutes);
dcartRoutes.use("/maps", mapRoutes);
dcartRoutes.use("/filters", filterRoutes);

export { dcartRoutes };
