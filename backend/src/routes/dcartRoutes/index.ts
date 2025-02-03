// import des bibliothèques
import express from "express";
// import des routes
import { categoryRoutes } from "./categoryRoutes";
import { mapRoutes } from "./mapRoutes";

const dcartRoutes = express.Router();

dcartRoutes.use("/categories", categoryRoutes);
dcartRoutes.use("/maps", mapRoutes);

export { dcartRoutes };
