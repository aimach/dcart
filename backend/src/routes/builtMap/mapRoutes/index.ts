// import des bibliothèques
import express from "express";
// import des routes
import { datationRoutes } from "./datationRoutes";
import { elementRoutes } from "./elementRoutes";
import { locationRoutes } from "./locationRoutes";
import { sourceRoutes } from "./sourceRoutes";
import { sourceTypeRoutes } from "./sourceTypeRoutes";

const mapRoutes = express.Router();

mapRoutes.use("/datation", datationRoutes);
mapRoutes.use("/elements", elementRoutes);
mapRoutes.use("/locations", locationRoutes);
mapRoutes.use("/sources", sourceRoutes);
mapRoutes.use("/sourceTypes", sourceTypeRoutes);

export { mapRoutes };
