// import des bibliothèques
import express from "express";
// import des routes
import { blockRoutes } from "./blockRoutes";
import { pointRoutes } from "./pointRoutes";
import { storymapContentRoutes } from "./storymapContentRoutes";
import { categoryRoutes } from "./categoryRoutes";
import { typeRoutes } from "./typeRoutes";
import { languageRoutes } from "./languageRoutes";

const storymapRoutes = express.Router();

storymapRoutes.use("/categories", categoryRoutes);
storymapRoutes.use("/blocks", blockRoutes);
// storymapRoutes.use("/points", pointRoutes);
storymapRoutes.use("/storymap", storymapContentRoutes);
storymapRoutes.use("/types", typeRoutes);
storymapRoutes.use("/languages", languageRoutes);

export { storymapRoutes };
