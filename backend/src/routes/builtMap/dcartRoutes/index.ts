// import des bibliothèques
import express from "express";
// import des routes
import { categoryRoutes } from "./categoryRoutes";
import { mapRoutes } from "./mapRoutes";
import { filterRoutes } from "./filterRoutes";
import { iconRoutes } from "./iconRoutes";
import { attestationRoutes } from "./attestationRoutes";
import { colorRoutes } from "./colorRoutes";

const dcartRoutes = express.Router();

dcartRoutes.use("/categories", categoryRoutes);
dcartRoutes.use("/maps", mapRoutes);
dcartRoutes.use("/filters", filterRoutes);
dcartRoutes.use("/icons", iconRoutes);
dcartRoutes.use("/colors", colorRoutes);
dcartRoutes.use("/attestations", attestationRoutes);

export { dcartRoutes };
